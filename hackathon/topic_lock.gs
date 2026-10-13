// PUB CSE Fest-26 Hackathon: topic selection, one choice per team leader.
// Paste into Extensions > Apps Script of the Google Sheet, save, run setup() once as the owner.
//
// How it works
//   Sheet "Teams": A #, B Team Name, C Leader Email, D Choose Topic, E Status.
//     Each D cell can be edited ONLY by that team's leader (Google range protection,
//     so identity is enforced by Google itself).
//   When a leader picks a topic in D, the script (running as the owner):
//     - rejects it if the topic already has 2 teams (the cell stays open to choose again);
//     - writes the team name into Team 1 / Team 2 of that topic on "Sheet1";
//     - removes the leader's edit right on that cell, so the choice is final.
//   "Sheet1" (topic list) is read-only for everyone except the owner.
//   Owner: delete a team's D cell to cancel its choice; the leader can then choose again.

const TOPIC_SHEET = 'Sheet1';
const TEAMS_SHEET = 'Teams';
const TEAM_COLS = [3, 4];            // Sheet1: C = Team 1, D = Team 2
const ID_PATTERN = /^[A-E]\d$/;      // Sheet1 rows whose column A is a problem ID
const COL_NAME = 2, COL_EMAIL = 3, COL_CHOICE = 4, COL_STATUS = 5;   // Teams sheet

function ss_() { return SpreadsheetApp.getActive(); }
function me_() { return Session.getEffectiveUser().getEmail(); }

function topicRows_(sh) {
  const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getDisplayValues();
  const rows = [];
  ids.forEach((v, i) => { if (ID_PATTERN.test(v[0].trim())) rows.push(i + 1); });
  return rows;
}

function topicLabels_(sh) {          // "C1 PUB CampusMate: ..." for the dropdown
  return topicRows_(sh).map(r =>
    sh.getRange(r, 1).getDisplayValue().trim() + ' ' + sh.getRange(r, 2).getDisplayValue().trim());
}

function teamRows_(ts) {
  const rows = [];
  for (let r = 2; r <= ts.getLastRow(); r++) if (ts.getRange(r, COL_NAME).getDisplayValue().trim()) rows.push(r);
  return rows;
}

function ownerOnly_(p) {
  p.addEditor(me_());
  p.removeEditors(p.getEditors().filter(u => u.getEmail() !== me_()));
  if (p.canDomainEdit()) p.setDomainEdit(false);
}

function choiceProtection_(ts, row) {
  const a1 = ts.getRange(row, COL_CHOICE).getA1Notation();
  let p = ts.getProtections(SpreadsheetApp.ProtectionType.RANGE).find(x => x.getRange().getA1Notation() === a1);
  if (!p) p = ts.getRange(row, COL_CHOICE).protect().setDescription('Choice: ' + ts.getRange(row, COL_NAME).getDisplayValue());
  return p;
}

function openForLeader_(ts, row) {   // only owner + this team's leader may edit the choice cell
  const p = choiceProtection_(ts, row);
  ownerOnly_(p);
  const email = ts.getRange(row, COL_EMAIL).getDisplayValue().trim();
  if (email) p.addEditor(email);
  ts.getRange(row, COL_STATUS).setValue('Not yet chosen');
  ts.getRange(row, COL_CHOICE).setBackground(null);
}

function lockChoice_(ts, row) {      // owner only from now on
  ownerOnly_(choiceProtection_(ts, row));
  ts.getRange(row, COL_STATUS).setValue('Locked');
  ts.getRange(row, COL_CHOICE).setBackground('#d9ead3').setNote(null);
}

function log_(what, team, topic, who) {
  ss_().getSheetByName('Log').appendRow([new Date(), what, team, topic, who]);
}

function findTopicRow_(sh, choice) {
  const id = String(choice).trim().split(/\s+/)[0];
  return topicRows_(sh).find(r => sh.getRange(r, 1).getDisplayValue().trim() === id);
}

function removeTeamFromTopics_(sh, team) {
  topicRows_(sh).forEach(r => TEAM_COLS.forEach(c => {
    const cell = sh.getRange(r, c);
    if (cell.getDisplayValue().trim().toLowerCase() === team.toLowerCase()) cell.clearContent();
  }));
}

// Run ONCE as the owner (safe to run again): protections, dropdown, trigger, log.
function setup() {
  const ss = ss_();
  const sh = ss.getSheetByName(TOPIC_SHEET);
  const ts = ss.getSheetByName(TEAMS_SHEET);

  [sh, ts].forEach(s => {
    s.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove());
    s.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove());
  });

  // Topic list: filled by the script only.
  sh.getRange(1, TEAM_COLS[0], sh.getMaxRows(), TEAM_COLS.length).clearDataValidations();
  ownerOnly_(sh.protect().setDescription('Topic list (filled automatically)'));

  // Teams sheet: locked, except each choice cell, which only its own leader may edit.
  const rows = teamRows_(ts);
  const tp = ts.protect().setDescription('Teams (owner only)');
  ownerOnly_(tp);
  tp.setUnprotectedRanges(rows.map(r => ts.getRange(r, COL_CHOICE)));

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(topicLabels_(sh), true)
    .setAllowInvalid(false)
    .setHelpText('Choose your topic. Your choice is final once accepted.')
    .build();
  rows.forEach(r => {
    ts.getRange(r, COL_CHOICE).setDataValidation(rule);
    if (ts.getRange(r, COL_CHOICE).getDisplayValue().trim()) lockChoice_(ts, r);
    else openForLeader_(ts, r);
  });

  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onChoice').forSpreadsheet(ss).onEdit().create();

  let log = ss.getSheetByName('Log');
  if (!log) {
    log = ss.insertSheet('Log');
    log.appendRow(['Time', 'Action', 'Team', 'Topic', 'By']);
    ownerOnly_(log.protect().setDescription('Log'));
  }
  log.hideSheet();
}

// Installable on-edit trigger: runs as the owner, so it may change protections.
function onChoice(e) {
  const r = e.range, ts = r.getSheet();
  if (ts.getName() !== TEAMS_SHEET || r.getColumn() !== COL_CHOICE || r.getNumRows() > 1 || r.getNumColumns() > 1) return;
  const row = r.getRow();
  if (!teamRows_(ts).includes(row)) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                                  // one choice at a time: first come, first served
  try {
    const sh = ss_().getSheetByName(TOPIC_SHEET);
    const team = ts.getRange(row, COL_NAME).getDisplayValue().trim();
    const who = e.user && e.user.getEmail ? e.user.getEmail() : '';
    const owner = who !== '' && who === me_();
    const choice = r.getDisplayValue().trim();

    if (e.oldValue && owner) {                           // organiser changed or cancelled a choice
      removeTeamFromTopics_(sh, team);
      if (!choice) { openForLeader_(ts, row); log_('CANCELLED', team, e.oldValue, 'organiser'); return; }
    } else if (e.oldValue) {                             // cannot normally happen (cell is locked)
      r.setValue(e.oldValue);
      return;
    }
    if (!choice) return;

    const tr = findTopicRow_(sh, choice);
    if (!tr) { r.clearContent(); r.setNote('Rejected: choose a topic from the list.'); return; }

    const free = TEAM_COLS.map(c => sh.getRange(tr, c)).find(c => c.getDisplayValue().trim() === '');
    if (!free) {
      r.clearContent();
      r.setNote(`${choice.split(' ')[0]} already has 2 teams. Please choose another topic.`);
      log_('REJECTED (full)', team, choice, owner ? 'organiser' : (who || 'leader'));
      return;
    }

    removeTeamFromTopics_(sh, team);                     // a team appears only once
    free.setValue(team);
    lockChoice_(ts, row);
    log_('CHOSEN', team, choice, owner ? 'organiser' : (who || 'leader'));
  } finally {
    lock.releaseLock();
  }
}
