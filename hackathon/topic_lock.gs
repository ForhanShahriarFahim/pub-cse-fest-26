// PUB CSE Fest-26 Hackathon: topic selection sheet with auto-lock.
// Paste into Extensions > Apps Script of the Google Sheet, save, run setup() once as the owner.
//
// Layout (as in PUB_CSE_Fest_2026_Hackathon_Topic_selection.xlsx):
//   column A = problem ID (A1..E3), B = topic, C = Team 1, D = Team 2, E = count formula.
//   Track heading rows and the header row are detected and stay locked.

const SHEET = 'Sheet1';            // tab name of the topic list
const TEAM_COLS = [3, 4];          // C = Team 1, D = Team 2
const ID_PATTERN = /^[A-E]\d$/;    // rows whose column A looks like "C1" are topic rows

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
  const open = [];
  topicRows_(sh).forEach(r => TEAM_COLS.forEach(c => {
    const cell = sh.getRange(r, c);
    if (String(cell.getValue()).trim() === '') open.push(cell);
  }));
  p.setUnprotectedRanges(open);
  ownerOnly_(p);

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

// Installable on-edit trigger: runs as the owner, so it may change protection.
function onTeamEntry(e) {
  const r = e.range, sh = r.getSheet();
  if (sh.getName() !== SHEET) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                                  // one edit at a time
  try {
    if (r.getNumRows() > 1 || r.getNumColumns() > 1) {   // no multi-cell paste or delete
      r.clearContent();
      return;
    }
    const row = r.getRow(), col = r.getColumn();
    if (!TEAM_COLS.includes(col) || !topicRows_(sh).includes(row)) return;

    if (e.oldValue) r.setValue(e.oldValue);              // first writer wins
    const name = String(r.getValue()).trim();
    if (!name) return;

    if (!e.oldValue) {                                   // one team, one topic
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

    SpreadsheetApp.getActive().getSheetByName('Log').appendRow([
      new Date(), r.getA1Notation(), sh.getRange(row, 1).getValue() + ' ' + sh.getRange(row, 2).getValue(), name,
      e.user && e.user.getEmail ? e.user.getEmail() : '',
    ]);
  } finally {
    lock.releaseLock();
  }
}
