/**
 * PUB CSE Fest-26 Hackathon: topic selection, one final choice per team leader.
 *
 * Use as a STANDALONE script (script.google.com > New project), not from the sheet's
 * Extensions menu: editors of a sheet can read and change a script attached to it,
 * and that script runs with the owner's permissions.
 *
 * Sheets (in the spreadsheet named by SPREADSHEET_ID):
 *   "Sheet1" topic list: A = ID (A1..E3), B = topic, C = Team 1, D = Team 2.  Owner only.
 *   "Teams":  A #, B Team Name, C Leader Email, D Choose Topic, E Status.
 *             Each D cell can be edited only by that row's leader (Google range protection).
 *   "Log":    every action, created by setup().
 *
 * Rules enforced:
 *   - the topic list is the single source of truth; the Teams row always follows it;
 *   - at most 2 teams per topic, first come first served (queued choices handled in arrival order);
 *   - a leader edits only their own cell; once accepted the cell is locked;
 *   - choices before openSelection() are refused; after closeSelection() nobody can choose;
 *   - the owner can cancel or move any team (edit the D cell, or edit Sheet1 directly).
 *
 * Owner steps (run from this editor):
 *   setup()           once, and again after changing teams/topics (selection must not be open)
 *   prepareLeaders()  a few minutes before the start: gives each leader access to their cell
 *   openSelection()   at the start time: choices are accepted from this moment
 *   closeSelection()  when done
 *   repair()          any time: fixes rows that disagree with the topic list, re-applies access
 *   cancelTeam()      cancels TEAM_TO_CANCEL (or just delete that team's D cell in the sheet)
 *   status()          prints a summary to the execution log
 */

// ===== Settings =====
const SPREADSHEET_ID = '1BsZN4_hy8e-TowAwR6uZzUmM2C79luCtB3a0eKIuTrQ';  // from the sheet URL
const TOPIC_SHEET = 'Sheet1';
const TEAMS_SHEET = 'Teams';
const LOG_SHEET = 'Log';
const LIST_SHEET = 'Lists';              // hidden list of topic labels for the dropdown (created by setup)
const TEAM_COLS = [3, 4];                // Sheet1: C = Team 1, D = Team 2 (2 teams per topic)
const ID_PATTERN = /^[A-Z]\d+$/;         // Sheet1 rows whose column A is a problem ID
const COL_NAME = 2, COL_EMAIL = 3, COL_CHOICE = 4, COL_STATUS = 5;   // Teams sheet
const OPENS_AT = '11:00 AM';             // shown to leaders before the start
const SEND_CONFIRMATION_EMAIL = true;    // email the leader when their choice is accepted
const TEAM_TO_CANCEL = '';               // team name for cancelTeam()

const LOCKED = 'Locked';
const GREEN = '#d9ead3', RED = '#f4cccc';

// ===== Basics =====
function book_() { return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActive(); }
function props_() { return PropertiesService.getScriptProperties(); }
function phase_() { return props_().getProperty('PHASE') || 'waiting'; }     // waiting | prepared | open | closed
function leaderAccess_() { const p = phase_(); return p === 'prepared' || p === 'open'; }

function normEmail_(e) {                 // Gmail ignores dots and case
  e = String(e || '').trim().toLowerCase();
  const m = e.match(/^([^@]+)@(gmail\.com|googlemail\.com)$/);
  return m ? m[1].replace(/\+.*$/, '').replace(/\./g, '') + '@gmail.com' : e;
}
function owner_() { return normEmail_(Session.getEffectiveUser().getEmail()); }

function idleText_() {
  const p = phase_();
  if (p === 'open') return 'Open: choose your topic';
  if (p === 'closed') return 'Selection closed';
  return 'Opens at ' + OPENS_AT;
}
function tooEarlyText_() {
  return phase_() === 'closed' ? 'Selection is closed' : 'Too early: choose again after ' + OPENS_AT;
}

// ===== Reading the sheets =====
function load_() {
  const ss = book_();
  const sh = ss.getSheetByName(TOPIC_SHEET), ts = ss.getSheetByName(TEAMS_SHEET);
  if (!sh || !ts) throw new Error('The spreadsheet needs sheets "' + TOPIC_SHEET + '" and "' + TEAMS_SHEET + '".');

  const topics = [];
  const nT = sh.getLastRow();
  if (nT) sh.getRange(1, 1, nT, Math.max.apply(null, TEAM_COLS)).getDisplayValues().forEach((v, i) => {
    const id = String(v[0]).trim().toUpperCase();
    if (!ID_PATTERN.test(id)) return;
    topics.push({ row: i + 1, id: id, label: (id + ' ' + String(v[1]).trim()).trim(),
                  slots: TEAM_COLS.map(c => String(v[c - 1]).trim()) });
  });

  const teams = [];
  const nM = ts.getLastRow();
  if (nM >= 2) ts.getRange(2, 1, nM - 1, COL_STATUS).getDisplayValues().forEach((v, i) => {
    const name = String(v[COL_NAME - 1]).trim();
    if (!name) return;
    teams.push({ row: i + 2, name: name, key: name.toLowerCase(), email: String(v[COL_EMAIL - 1]).trim(),
                 choice: String(v[COL_CHOICE - 1]).trim(), status: String(v[COL_STATUS - 1]).trim() });
  });
  return { ss: ss, sh: sh, ts: ts, topics: topics, teams: teams, prot: null, notify: [] };
}

function topicOfChoice_(st, choice) {
  if (!choice) return null;
  const id = choice.split(/\s+/)[0].toUpperCase();
  return st.topics.find(t => t.id === id) || null;
}
function placedTopic_(st, team) { return st.topics.find(t => t.slots.some(s => s.toLowerCase() === team.key)) || null; }
function freeSlot_(topic) { return topic.slots.findIndex(s => s === ''); }

// ===== Writing the topic list (source of truth) =====
function setSlot_(st, topic, k, value) {
  const cell = st.sh.getRange(topic.row, TEAM_COLS[k]);
  if (value) cell.setValue(value); else cell.clearContent();
  topic.slots[k] = value;
}
function place_(st, team, topic) { setSlot_(st, topic, freeSlot_(topic), team.name); }
function unplace_(st, team) {
  st.topics.forEach(t => t.slots.forEach((s, k) => { if (s.toLowerCase() === team.key) setSlot_(st, t, k, ''); }));
}

// Duplicates of a registered team are always removed (first one kept).
// Names that are not registered teams are removed only by setup()/repair().
function cleanTopicList_(st, removeUnknown) {
  const known = new Set(st.teams.map(t => t.key)), seen = new Set();
  st.topics.forEach(tp => tp.slots.forEach((s, k) => {
    if (!s) return;
    const key = s.toLowerCase();
    if (!known.has(key)) {
      if (removeUnknown) { setSlot_(st, tp, k, ''); log_(st, 'REMOVED (not a registered team)', s, tp.label, 'repair'); }
      return;
    }
    if (seen.has(key)) { setSlot_(st, tp, k, ''); log_(st, 'REMOVED (duplicate)', s, tp.label, 'repair'); }
    else seen.add(key);
  }));
}

// The owner typed a team name into a Sheet1 slot: keep that one, remove the team elsewhere.
function keepOwnerPlacement_(st, row, col) {
  const k = TEAM_COLS.indexOf(col), topic = st.topics.find(t => t.row === row);
  if (k < 0 || !topic || !topic.slots[k]) return;
  const key = topic.slots[k].toLowerCase();
  st.topics.forEach(t => t.slots.forEach((s, j) => {
    if ((t !== topic || j !== k) && s.toLowerCase() === key) setSlot_(st, t, j, '');
  }));
}

// ===== Writing the Teams rows =====
function ownerOnly_(p) {
  const me = Session.getEffectiveUser().getEmail();
  p.addEditor(me);
  const others = p.getEditors().filter(u => normEmail_(u.getEmail()) !== normEmail_(me));
  if (others.length) p.removeEditors(others);
  if (p.canDomainEdit()) p.setDomainEdit(false);
}

function choiceProtection_(st, team) {
  if (!st.prot) {
    st.prot = {};
    st.ts.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => { st.prot[p.getRange().getA1Notation()] = p; });
  }
  const cell = st.ts.getRange(team.row, COL_CHOICE), a1 = cell.getA1Notation();
  if (!st.prot[a1]) st.prot[a1] = cell.protect().setDescription('Choice: ' + team.name);
  return st.prot[a1];
}

// Owner only, plus the leader when allow is true. Returns '' or a problem text.
function setAccess_(st, team, allow) {
  const p = choiceProtection_(st, team);
  ownerOnly_(p);
  if (!allow) return '';
  if (!team.email) return 'ERROR: leader email missing';
  try { p.addEditor(team.email); } catch (err) { return 'ERROR: cannot give access to ' + team.email; }
  const ok = p.getEditors().some(u => normEmail_(u.getEmail()) === normEmail_(team.email));
  return ok ? '' : 'ERROR: cannot give access to ' + team.email;
}

function setChoice_(st, team, value) {
  if (team.choice === value) return;
  const cell = st.ts.getRange(team.row, COL_CHOICE);
  if (value) cell.setValue(value); else cell.clearContent();
  team.choice = value;
}
function setStatus_(st, team, text, color) {
  if (team.status === text) return;
  st.ts.getRange(team.row, COL_STATUS).setValue(text).setBackground(color || null);
  team.status = text;
}

function lockRow_(st, team, topic) {                 // choice accepted: owner only from now on
  setChoice_(st, team, topic.label);
  if (team.status === LOCKED) return;
  setAccess_(st, team, false);
  st.ts.getRange(team.row, COL_CHOICE).setBackground(GREEN);
  setStatus_(st, team, LOCKED, GREEN);
}
function rejectRow_(st, team, text) {                // leader keeps access and may choose again
  setChoice_(st, team, '');
  setStatus_(st, team, text, RED);
}
function reopenRow_(st, team, text) {                // after a cancellation
  setChoice_(st, team, '');
  const problem = setAccess_(st, team, leaderAccess_());
  st.ts.getRange(team.row, COL_CHOICE).setBackground(null);
  setStatus_(st, team, problem || text, problem ? RED : null);
}

function log_(st, action, team, topic, by) {
  let lg = st.ss.getSheetByName(LOG_SHEET);
  if (!lg) { lg = st.ss.insertSheet(LOG_SHEET); lg.appendRow(['Time', 'Action', 'Team', 'Topic', 'By']); }
  lg.appendRow([new Date(), action, team, topic, by]);
}

// ===== The rules =====
// A row nobody is editing right now: the topic list decides.
function settle_(st, team) {
  const placed = placedTopic_(st, team);
  if (placed) { lockRow_(st, team, placed); return; }
  if (team.status === LOCKED) {                      // it was accepted, then removed from the topic list
    reopenRow_(st, team, phase_() === 'open' ? 'Cancelled: choose again' : idleText_());
    log_(st, 'CANCELLED', team.name, team.choice, 'organiser (topic list)');
    return;
  }
  if (!team.choice) return;
  const topic = topicOfChoice_(st, team.choice);
  if (!topic) { rejectRow_(st, team, 'Invalid: choose a topic from the list'); return; }
  if (phase_() !== 'open') {
    log_(st, 'REFUSED (not open)', team.name, topic.label, team.email);
    rejectRow_(st, team, tooEarlyText_());
    return;
  }
  if (freeSlot_(topic) < 0) {
    log_(st, 'REFUSED (full)', team.name, topic.label, team.email);
    rejectRow_(st, team, topic.id + ' already has 2 teams: choose another topic');
    return;
  }
  place_(st, team, topic);
  lockRow_(st, team, topic);
  log_(st, 'CHOSEN', team.name, topic.label, team.email);
  st.notify.push({ email: team.email, team: team.name, topic: topic.label });
}

// A row the owner just edited in the Teams sheet: the owner's value decides.
function ownerEdit_(st, team) {
  const placed = placedTopic_(st, team);
  if (!team.choice) {
    if (placed) unplace_(st, team);
    if (placed || team.status === LOCKED) log_(st, 'CANCELLED', team.name, placed ? placed.label : '', 'organiser');
    reopenRow_(st, team, (placed || team.status === LOCKED) && phase_() === 'open' ? 'Cancelled: choose again' : idleText_());
    return;
  }
  const topic = topicOfChoice_(st, team.choice);
  if (topic && placed === topic) { lockRow_(st, team, topic); return; }
  if (!topic || freeSlot_(topic) < 0) {              // invalid or full: undo the owner's edit
    log_(st, 'OWNER CHANGE REFUSED (' + (topic ? 'full' : 'invalid') + ')', team.name, team.choice, 'organiser');
    if (placed) { team.status = ''; lockRow_(st, team, placed); }
    else rejectRow_(st, team, topic ? topic.id + ' already has 2 teams' : 'Invalid: choose a topic from the list');
    return;
  }
  if (placed) unplace_(st, team);
  place_(st, team, topic);
  team.status = '';                                  // force the lock to be (re)applied
  lockRow_(st, team, topic);
  log_(st, placed ? 'MOVED' : 'ASSIGNED', team.name, topic.label, 'organiser');
  st.notify.push({ email: team.email, team: team.name, topic: topic.label });
}

// Owner-edited rows first, then leaders' choices in arrival order, then every other row.
function reconcile_(st, ownerRows, stamps) {
  const stamp = r => (stamps['pending_' + r] ? Number(stamps['pending_' + r]) : Infinity);
  const order = st.teams.slice().sort((a, b) => {
    const oa = ownerRows.has(a.row), ob = ownerRows.has(b.row);
    if (oa !== ob) return oa ? -1 : 1;
    const sa = stamp(a.row), sb = stamp(b.row);
    if (sa !== sb) return sa < sb ? -1 : 1;
    return a.row - b.row;
  });
  order.forEach(team => {
    try { if (ownerRows.has(team.row)) ownerEdit_(st, team); else settle_(st, team); }
    catch (err) { try { log_(st, 'ERROR', team.name, String(err), ''); } catch (ignore) {} }
    if (stamps['pending_' + team.row]) props_().deleteProperty('pending_' + team.row);
  });
}

// ===== Locking and sending =====
function ownerLock_(fn) {
  if (!withLock_(60000, fn)) throw new Error('The sheet is busy processing choices. Try again in a minute.');
}

function withLock_(waitMs, fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(waitMs)) return false;
  let st = null;
  try { st = fn(); }
  finally { SpreadsheetApp.flush(); lock.releaseLock(); }   // everything is written before the next run reads
  if (st) sendConfirmations_(st.notify);
  return true;
}

function sendConfirmations_(list) {
  if (!SEND_CONFIRMATION_EMAIL) return;
  list.forEach(n => {
    if (!n.email) return;
    try {
      MailApp.sendEmail(n.email, 'Hackathon topic confirmed: ' + n.topic.split(' ')[0],
        'Dear team leader,\n\nYour team "' + n.team + '" has been allocated:\n\n    ' + n.topic +
        '\n\nThis choice is final. For any problem, please contact the organisers.\n\nPUB CSE Fest-26 Hackathon Committee');
    } catch (err) { /* the sheet and the Log remain the record */ }
  });
}

// ===== Triggers =====
// Installable on-edit trigger (created by setup), runs as the owner.
function onChoice(e) {
  try {
    if (!e || !e.range) return;
    const range = e.range, name = range.getSheet().getName();
    const r1 = range.getRow(), r2 = range.getLastRow(), c1 = range.getColumn(), c2 = range.getLastColumn();
    const inChoices = name === TEAMS_SHEET && c1 <= COL_CHOICE && c2 >= COL_CHOICE && r2 >= 2;
    const inSlots = name === TOPIC_SHEET && c1 <= Math.max.apply(null, TEAM_COLS) && c2 >= Math.min.apply(null, TEAM_COLS);
    if (!inChoices && !inSlots) return;

    const who = normEmail_(e.user && e.user.getEmail ? e.user.getEmail() : '');
    const byOwner = who !== '' && who === owner_();

    if (inChoices && !byOwner) {                     // arrival time: queued choices are handled in this order
      const p = props_(), now = String(Date.now());
      for (let r = Math.max(r1, 2); r <= r2; r++) if (!p.getProperty('pending_' + r)) p.setProperty('pending_' + r, now);
    }
    withLock_(300000, () => {                        // waits up to 5 min; otherwise sweep() picks it up
      const stamps = props_().getProperties();
      const st = load_();
      const ownerRows = new Set();
      if (byOwner && inChoices) for (let r = r1; r <= r2; r++) ownerRows.add(r);
      if (byOwner && inSlots && r1 === r2 && c1 === c2) keepOwnerPlacement_(st, r1, c1);
      cleanTopicList_(st, false);
      reconcile_(st, ownerRows, stamps);
      return st;
    });
  } catch (err) {
    console.error(err);
  }
}

// Time-driven safety net while selection is open (every minute).
function sweep() {
  withLock_(60000, () => {
    const stamps = props_().getProperties();
    const st = load_();
    cleanTopicList_(st, false);
    reconcile_(st, new Set(), stamps);
    return st;
  });
}

function setSweep_(on) {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'sweep').forEach(t => ScriptApp.deleteTrigger(t));
  if (on) ScriptApp.newTrigger('sweep').timeBased().everyMinutes(1).create();
}

// ===== Owner functions =====
function requireOwner_() {
  const owner = book_().getOwner();
  if (!owner) return;
  const me = normEmail_(Session.getActiveUser().getEmail());
  if (me !== normEmail_(owner.getEmail())) throw new Error('Run this as the sheet owner (' + owner.getEmail() + ').');
}

function validate_(st) {
  const problems = [], names = {}, emails = {}, ids = {};
  if (!st.topics.length) problems.push('No topic rows found in "' + TOPIC_SHEET + '" (column A must hold IDs like A1).');
  st.topics.forEach(t => { if (ids[t.id]) problems.push('Topic ID ' + t.id + ' appears twice'); ids[t.id] = true; });
  st.teams.forEach(t => {
    if (names[t.key]) problems.push('Team "' + t.name + '" appears on rows ' + names[t.key] + ' and ' + t.row);
    else names[t.key] = t.row;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t.email)) { problems.push('Row ' + t.row + ': invalid leader email "' + t.email + '"'); return; }
    const e = normEmail_(t.email);
    if (emails[e]) problems.push('Rows ' + emails[e] + ' and ' + t.row + ' have the same leader email');
    else emails[e] = t.row;
  });
  if (problems.length) throw new Error('Please fix the sheet first:\n- ' + problems.join('\n- '));
}

function setup() {
  requireOwner_();
  if (phase_() === 'open') throw new Error('Selection is open. Run closeSelection() first, or use repair().');
  ownerLock_(() => {
    const st = load_();
    validate_(st);
    const P = SpreadsheetApp.ProtectionType;

    [st.sh, st.ts].forEach(s => {
      s.getProtections(P.SHEET).forEach(p => p.remove());
      s.getProtections(P.RANGE).forEach(p => p.remove());
    });
    ownerOnly_(st.sh.protect().setDescription('Topic list: filled by the script'));
    const tp = st.ts.protect().setDescription('Teams: owner only');
    ownerOnly_(tp);
    tp.setUnprotectedRanges(st.teams.map(t => st.ts.getRange(t.row, COL_CHOICE)));
    st.prot = {};
    st.teams.forEach(t => {
      const cell = st.ts.getRange(t.row, COL_CHOICE);
      const p = cell.protect().setDescription('Choice: ' + t.name);
      ownerOnly_(p);
      st.prot[cell.getA1Notation()] = p;
    });

    // Dropdown values come from a hidden sheet, so topic names may contain commas.
    let ls = st.ss.getSheetByName(LIST_SHEET);
    if (!ls) ls = st.ss.insertSheet(LIST_SHEET);
    ls.clear();
    ls.getRange(1, 1, st.topics.length, 1).setValues(st.topics.map(t => [t.label]));
    ls.getProtections(P.SHEET).forEach(p => p.remove());
    ownerOnly_(ls.protect().setDescription('Topic labels for the dropdown'));
    ls.hideSheet();
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ls.getRange(1, 1, st.topics.length, 1), true)
      .setAllowInvalid(false)
      .setHelpText('Choose your topic. Once accepted it is final.')
      .build();
    st.teams.forEach(t => st.ts.getRange(t.row, COL_CHOICE).setDataValidation(rule).setNote(''));
    st.topics.forEach(tp2 => TEAM_COLS.forEach(c => st.sh.getRange(tp2.row, c).clearDataValidations().setNote('')));

    let lg = st.ss.getSheetByName(LOG_SHEET);
    if (!lg) { lg = st.ss.insertSheet(LOG_SHEET); lg.appendRow(['Time', 'Action', 'Team', 'Topic', 'By']); }
    lg.getProtections(P.SHEET).forEach(p => p.remove());
    ownerOnly_(lg.protect().setDescription('Log'));
    lg.hideSheet();
    lg.appendRow([new Date(), 'SETUP', '', '', 'organiser']);

    ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
    ScriptApp.newTrigger('onChoice').forSpreadsheet(st.ss).onEdit().create();

    props_().deleteAllProperties();
    props_().setProperty('PHASE', 'waiting');

    cleanTopicList_(st, true);
    st.teams.forEach(t => {                          // the topic list decides; everything else starts empty
      const placed = placedTopic_(st, t);
      if (placed) { t.status = ''; lockRow_(st, t, placed); return; }
      setChoice_(st, t, '');
      st.ts.getRange(t.row, COL_CHOICE).setBackground(null);
      setStatus_(st, t, idleText_(), null);
    });
    return st;
  });
  status();
}

function prepareLeaders() {
  requireOwner_();
  if (phase_() === 'open') throw new Error('Selection is already open.');
  ownerLock_(() => {
    props_().setProperty('PHASE', 'prepared');
    const st = load_();
    const shared = new Set(st.ss.getEditors().map(u => normEmail_(u.getEmail())));
    st.teams.forEach(t => {
      if (t.status === LOCKED) return;
      let problem = setAccess_(st, t, true);
      if (!problem && !shared.has(normEmail_(t.email))) problem = 'ERROR: share the sheet with ' + t.email + ' (Editor)';
      setStatus_(st, t, problem || idleText_(), problem ? RED : null);
    });
    return st;
  });
  status();
}

function openSelection() {
  requireOwner_();
  if (phase_() !== 'prepared') prepareLeaders();
  ownerLock_(() => {
    props_().setProperty('PHASE', 'open');           // choices count from this moment
    const st = load_();
    st.teams.forEach(t => {
      if (t.status !== LOCKED && t.status.indexOf('ERROR') !== 0) setStatus_(st, t, idleText_(), null);
    });
    log_(st, 'OPENED', '', '', 'organiser');
    return st;
  });
  setSweep_(true);
  status();
}

function closeSelection() {
  requireOwner_();
  ownerLock_(() => {
    const stamps = props_().getProperties();
    let st = load_();
    reconcile_(st, new Set(), stamps);               // honour choices made before closing
    props_().setProperty('PHASE', 'closed');
    st.teams.forEach(t => {
      if (t.status === LOCKED) return;
      setAccess_(st, t, false);
      setChoice_(st, t, '');
      setStatus_(st, t, idleText_(), null);
    });
    log_(st, 'CLOSED', '', '', 'organiser');
    return st;
  });
  setSweep_(false);
  status();
}

function repair() {
  requireOwner_();
  ownerLock_(() => {
    const stamps = props_().getProperties();
    const st = load_();
    cleanTopicList_(st, true);
    reconcile_(st, new Set(), stamps);
    st.teams.forEach(t => {
      if (t.status === LOCKED) { setAccess_(st, t, false); return; }
      const problem = setAccess_(st, t, leaderAccess_());
      if (problem) setStatus_(st, t, problem, RED);
      else if (t.status === '' || t.status.indexOf('ERROR') === 0) setStatus_(st, t, idleText_(), null);
    });
    return st;
  });
  status();
}

function cancelTeam() {
  requireOwner_();
  if (!TEAM_TO_CANCEL.trim()) throw new Error('Write the team name in TEAM_TO_CANCEL at the top, save, then run cancelTeam().');
  ownerLock_(() => {
    const st = load_();
    const team = st.teams.find(t => t.key === TEAM_TO_CANCEL.trim().toLowerCase());
    if (!team) throw new Error('No team named "' + TEAM_TO_CANCEL + '" in the Teams sheet.');
    const placed = placedTopic_(st, team);
    unplace_(st, team);
    reopenRow_(st, team, phase_() === 'open' ? 'Cancelled: choose again' : idleText_());
    log_(st, 'CANCELLED', team.name, placed ? placed.label : '', 'organiser');
    return st;
  });
  status();
}

function status() {
  const st = load_();
  const locked = st.teams.filter(t => t.status === LOCKED).length;
  const errors = st.teams.filter(t => t.status.indexOf('ERROR') === 0);
  const lines = ['Phase: ' + phase_(), 'Teams: ' + st.teams.length + ', locked: ' + locked + ', not yet: ' + (st.teams.length - locked)];
  errors.forEach(t => lines.push('Row ' + t.row + ' ' + t.name + ': ' + t.status));
  st.topics.forEach(t => { if (t.slots.filter(Boolean).length) lines.push(t.id + ': ' + t.slots.filter(Boolean).join(', ')); });
  console.log(lines.join('\n'));
  return lines.join('\n');
}
