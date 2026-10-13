// PUB CSE Fest-26 Hackathon: topic selection sheet with auto-lock.
// Paste into Extensions > Apps Script of the Google Sheet, save, run setup() once as the owner.
//
// Layout (as in PUB_CSE_Fest_2026_Hackathon_Topic_selection.xlsx):
//   column A = problem ID (A1..E3), B = topic, C = Team 1, D = Team 2, E = count formula.
//   Track heading rows and the header row are detected and stay locked.
//   Sheet 'Teams' lists the registered team names (column B); team cells accept only those names.

const SHEET = 'Sheet1';            // tab name of the topic list
const TEAM_COLS = [3, 4];          // C = Team 1, D = Team 2
const ID_PATTERN = /^[A-E]\d$/;    // rows whose column A looks like "C1" are topic rows
const TEAMS_SHEET = 'Teams';       // registered team names in column B, from row 2

function registeredTeams_() {
  const ts = SpreadsheetApp.getActive().getSheetByName(TEAMS_SHEET);
  return ts.getRange(2, 2, Math.max(ts.getLastRow() - 1, 1), 1).getDisplayValues()
    .map(v => v[0].trim()).filter(Boolean);
}

function topicRows_(sh) {
  const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getDisplayValues();
  const rows = [];
  ids.forEach((v, i) => { if (ID_PATTERN.test(v[0].trim())) rows.push(i + 1); });
  return rows;
}

function ownerOnly_(p) {
  const me = Session.getEffectiveUser();
  p.addEditor(me);
  p.removeEditors(p.getEditors().filter(u => u.getEmail() !== me.getEmail()));
  if (p.canDomainEdit()) p.setDomainEdit(false);
}

// Run ONCE (and again after you clear test entries): protects the sheet,
// leaves only empty team cells editable, installs the trigger, creates the log.
function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET);
  sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove());
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove());

  const p = sh.protect().setDescription('Topic list: only empty team cells are editable');
  ownerOnly_(p);
  syncOpenCells_(sh);

  // Team cells accept only registered team names (dropdown, invalid input rejected).
  const ts = ss.getSheetByName(TEAMS_SHEET);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ts.getRange(2, 2, Math.max(ts.getLastRow() - 1, 1), 1), true)
    .setAllowInvalid(false)
    .setHelpText('Choose your registered team name.')
    .build();
  topicRows_(sh).forEach(r => TEAM_COLS.forEach(c => sh.getRange(r, c).setDataValidation(rule)));
  ts.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(x => x.remove());
  ownerOnly_(ts.protect().setDescription('Registered teams'));

  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onTeamEntry').forSpreadsheet(ss).onEdit().create();

  let log = ss.getSheetByName('Log');
  if (!log) {
    log = ss.insertSheet('Log');
    log.appendRow(['Time', 'Cell', 'Problem', 'Team', 'Editor']);
    ownerOnly_(log.protect().setDescription('Log'));
  }
  log.hideSheet();
}

// Every empty team cell is editable; every filled one is locked.
function syncOpenCells_(sh) {
  const p = sh.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
  const open = [];
  topicRows_(sh).forEach(r => TEAM_COLS.forEach(c => {
    const cell = sh.getRange(r, c);
    if (String(cell.getValue()).trim() === '') {
      open.push(cell);
      cell.setBackground(null).setNote(null);
    }
  }));
  p.setUnprotectedRanges(open);
}

function isOwner_(e) {
  const who = e.user && e.user.getEmail ? e.user.getEmail() : '';
  return who !== '' && who === Session.getEffectiveUser().getEmail();
}

function log_(cellA1, problem, team, who) {
  SpreadsheetApp.getActive().getSheetByName('Log').appendRow([new Date(), cellA1, problem, team, who]);
}

// Owner menu: after clearing cells by hand, reopen them for selection.
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Hackathon')
    .addItem('Reopen cleared cells', 'reopenClearedCells')
    .addToUi();
}

function reopenClearedCells() {
  syncOpenCells_(SpreadsheetApp.getActive().getSheetByName(SHEET));
}

// Installable on-edit trigger: runs as the owner, so it may change protection.
function onTeamEntry(e) {
  const r = e.range, sh = r.getSheet();
  if (sh.getName() !== SHEET) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                                  // one edit at a time
  try {
    const owner = isOwner_(e);
    if (r.getNumRows() > 1 || r.getNumColumns() > 1) {   // multi-cell edit
      if (owner) syncOpenCells_(sh);                     // organiser cleared a block: reopen it
      else r.clearContent();                             // students may not paste or drag
      return;
    }
    const row = r.getRow(), col = r.getColumn();
    if (!TEAM_COLS.includes(col) || !topicRows_(sh).includes(row)) return;
    const problem = sh.getRange(row, 1).getValue() + ' ' + sh.getRange(row, 2).getValue();

    if (!owner && e.oldValue) r.setValue(e.oldValue);    // first writer wins
    let name = String(r.getValue()).trim();
    if (!name) {
      if (owner && e.oldValue) {                         // organiser cleared a selection
        syncOpenCells_(sh);
        log_(r.getA1Notation(), problem, `CLEARED (was ${e.oldValue})`, 'organiser');
      }
      return;
    }

    // Only registered team names (also catches anything that slips past the dropdown).
    const official = registeredTeams_().find(t => t.toLowerCase() === name.toLowerCase());
    if (!official) {
      r.clearContent();
      r.setNote(`Rejected: "${name}" is not a registered team name.`);
      return;
    }
    if (official !== name) { r.setValue(official); name = official; }

    if (!e.oldValue || owner) {                          // one team, one topic
      const taken = topicRows_(sh)
        .flatMap(rr => TEAM_COLS.map(c => sh.getRange(rr, c).getDisplayValue().trim().toLowerCase()));
      if (taken.filter(v => v === name.toLowerCase()).length > 1) {
        r.clearContent();
        r.setNote(`Rejected: "${name}" has already chosen a topic.`);
        return;
      }
    }

    const p = sh.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
    p.setUnprotectedRanges(p.getUnprotectedRanges().filter(u => u.getA1Notation() !== r.getA1Notation()));
    r.setBackground('#d9ead3').setNote(null);

    log_(r.getA1Notation(), problem, name, owner ? 'organiser' : (e.user && e.user.getEmail ? e.user.getEmail() : ''));
  } finally {
    lock.releaseLock();
  }
}
