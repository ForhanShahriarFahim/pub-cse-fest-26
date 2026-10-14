// Simulation tests for hackathon/topic_lock.gs.
// Run: node hackathon/test/topic_lock.test.js
//
// The mock models what matters for correctness:
//   - sheet values, backgrounds, data validation;
//   - sheet and range protections, and who may edit which cell (default editors = everyone with access);
//   - script runs one at a time (script lock), but a run's unflushed writes are committed only
//     AFTER the next run has read the sheet (the worst case that caused the DEMO 4 bug);
//   - triggers, script properties, mail.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const SCRIPT = fs.readFileSync(path.join(__dirname, '..', 'topic_lock.gs'), 'utf8');
const FIXTURE = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixture.json'), 'utf8'));
const OWNER = 'fahim.cse.pub@gmail.com';

function makeWorld({ noFlush = false, scriptPatch = s => s } = {}) {
  const W = { sheets: {}, props: {}, triggers: [], mails: [], fileEditors: new Set(), activeUser: OWNER,
              exec: null, deferred: [], clock: 1000, noFlush };

  // ---------- storage ----------
  function newSheet(name, rows) {
    const sh = { name, cells: new Map(), protections: [], hidden: false };
    (rows || []).forEach((row, i) => row.forEach((v, j) => { if (v !== '') sh.cells.set(`${i + 1},${j + 1}`, { v: String(v) }); }));
    W.sheets[name] = sh;
    return sh;
  }
  const cellRec = (sh, r, c) => { const k = `${r},${c}`; if (!sh.cells.has(k)) sh.cells.set(k, {}); return sh.cells.get(k); };
  function read(sh, r, c, field) {
    if (W.exec) for (let i = W.exec.buf.length - 1; i >= 0; i--) {
      const op = W.exec.buf[i];
      if (op.sh === sh && op.r === r && op.c === c && op.field === field) return op.value;
    }
    const rec = sh.cells.get(`${r},${c}`);
    return rec && rec[field] !== undefined ? rec[field] : (field === 'v' ? '' : null);
  }
  function write(sh, r, c, field, value) {
    const op = { sh, r, c, field, value };
    if (W.exec) W.exec.buf.push(op); else apply([op]);
  }
  function apply(ops) { ops.forEach(op => { cellRec(op.sh, op.r, op.c)[op.field] = op.value; }); }
  function flush() { if (W.exec && !W.noFlush) { apply(W.exec.buf); W.exec.buf = []; } }
  function lastRow(sh) {
    let m = 0;
    const consider = (r, v) => { if (v !== '' && v != null && r > m) m = r; };
    sh.cells.forEach((rec, k) => consider(Number(k.split(',')[0]), read(sh, Number(k.split(',')[0]), Number(k.split(',')[1]), 'v')));
    if (W.exec) W.exec.buf.forEach(op => { if (op.sh === sh && op.field === 'v') consider(op.r, read(sh, op.r, op.c, 'v')); });
    return m;
  }

  // ---------- users ----------
  const user = e => ({ getEmail: () => e });

  // ---------- protections ----------
  const inRange = (rg, r, c) => r >= rg.r && r < rg.r + rg.nr && c >= rg.c && c < rg.c + rg.nc;
  function makeProtection(sh, type, rg) {
    const p = { type, rg, editors: new Set([OWNER, ...W.fileEditors]), unprotected: [], domain: false, removed: false };
    sh.protections.push(p);
    const api = {
      setDescription: () => api,
      addEditor: e => { if (!/@/.test(e)) throw new Error('bad email'); p.editors.add(e.toLowerCase()); return api; },
      removeEditors: list => { list.forEach(u => p.editors.delete((typeof u === 'string' ? u : u.getEmail()).toLowerCase())); return api; },
      getEditors: () => [...p.editors].map(user),
      canDomainEdit: () => p.domain,
      setDomainEdit: b => { p.domain = b; return api; },
      setUnprotectedRanges: ranges => { p.unprotected = ranges.map(x => x._rg); return api; },
      getRange: () => new Range(sh, rg.r, rg.c, rg.nr, rg.nc),
      remove: () => { p.removed = true; sh.protections = sh.protections.filter(x => x !== p); },
      _p: p,
    };
    p.api = api;
    return api;
  }
  function canEdit(email, sh, r, c) {
    email = email.toLowerCase();
    if (email === OWNER) return true;
    if (!W.fileEditors.has(email)) return false;
    for (const p of sh.protections) {
      if (p.type === 'SHEET') {
        if (p.unprotected.some(u => inRange(u, r, c))) continue;
        if (!p.editors.has(email)) return false;
      } else if (inRange(p.rg, r, c) && !p.editors.has(email)) return false;
    }
    return true;
  }

  // ---------- Range / Sheet / Spreadsheet ----------
  class Range {
    constructor(sh, r, c, nr = 1, nc = 1) { this._sh = sh; this._rg = { r, c, nr, nc }; }
    each(fn) { for (let i = 0; i < this._rg.nr; i++) for (let j = 0; j < this._rg.nc; j++) fn(this._rg.r + i, this._rg.c + j, i, j); }
    getRow() { return this._rg.r; } getColumn() { return this._rg.c; }
    getLastRow() { return this._rg.r + this._rg.nr - 1; } getLastColumn() { return this._rg.c + this._rg.nc - 1; }
    getNumRows() { return this._rg.nr; } getNumColumns() { return this._rg.nc; }
    getSheet() { return sheetApi(this._sh); }
    getA1Notation() { return String.fromCharCode(64 + this._rg.c) + this._rg.r; }
    getDisplayValues() { const out = []; this.each((r, c, i, j) => { (out[i] = out[i] || [])[j] = String(read(this._sh, r, c, 'v')); }); return out; }
    getDisplayValue() { return String(read(this._sh, this._rg.r, this._rg.c, 'v')); }
    getValue() { return this.getDisplayValue(); }
    setValue(v) { this.each((r, c) => write(this._sh, r, c, 'v', String(v))); return this; }
    setValues(a) { this.each((r, c, i, j) => write(this._sh, r, c, 'v', String(a[i][j]))); return this; }
    clearContent() { this.each((r, c) => write(this._sh, r, c, 'v', '')); return this; }
    setBackground(b) { this.each((r, c) => write(this._sh, r, c, 'bg', b)); return this; }
    setNote(n) { this.each((r, c) => write(this._sh, r, c, 'note', n)); return this; }
    setDataValidation(rule) { this.each((r, c) => { cellRec(this._sh, r, c).dv = rule; }); return this; }
    clearDataValidations() { this.each((r, c) => { cellRec(this._sh, r, c).dv = null; }); return this; }
    protect() { return makeProtection(this._sh, 'RANGE', this._rg); }
  }
  const sheetCache = new Map();
  function sheetApi(sh) {
    if (sheetCache.has(sh)) return sheetCache.get(sh);
    const api = {
      getName: () => sh.name,
      getLastRow: () => lastRow(sh),
      getMaxRows: () => 1000,
      getRange: (r, c, nr, nc) => new Range(sh, r, c, nr || 1, nc || 1),
      getProtections: type => sh.protections.filter(p => p.type === type).map(p => p.api),
      protect: () => makeProtection(sh, 'SHEET', { r: 1, c: 1, nr: 100000, nc: 100 }),
      appendRow: arr => { const r = lastRow(sh) + 1; arr.forEach((v, j) => write(sh, r, j + 1, 'v', v instanceof Date ? 'T' : String(v))); return api; },
      hideSheet: () => { sh.hidden = true; return api; },
      clear: () => { sh.cells.forEach((rec, k) => { const [r, c] = k.split(',').map(Number); write(sh, r, c, 'v', ''); }); return api; },
    };
    sheetCache.set(sh, api);
    return api;
  }
  const book = {
    getSheetByName: n => (W.sheets[n] ? sheetApi(W.sheets[n]) : null),
    insertSheet: n => sheetApi(newSheet(n, [])),
    getOwner: () => user(OWNER),
    getEditors: () => [OWNER, ...W.fileEditors].map(user),
    getId: () => 'ID',
  };

  // ---------- services ----------
  function DVBuilder() {
    const rule = { allowInvalid: true };
    const b = {
      requireValueInList: list => { rule.values = () => list; return b; },
      requireValueInRange: rg => { rule.values = () => rg.getDisplayValues().map(x => x[0]); return b; },
      setAllowInvalid: v => { rule.allowInvalid = v; return b; },
      setHelpText: () => b,
      build: () => rule,
    };
    return b;
  }
  function trigBuilder(fn) {
    const t = { fn, kind: null };
    const api = {
      forSpreadsheet: () => api, onEdit: () => { t.kind = 'edit'; return api; },
      timeBased: () => api, everyMinutes: () => { t.kind = 'time'; return api; },
      create: () => { const tr = { getHandlerFunction: () => fn, _t: t }; W.triggers.push(tr); return tr; },
    };
    return api;
  }
  class FakeDate extends Date { static now() { return ++W.clock; } }
  const ctx = {
    SpreadsheetApp: {
      openById: () => book, getActive: () => book, flush,
      ProtectionType: { SHEET: 'SHEET', RANGE: 'RANGE' },
      newDataValidation: DVBuilder,
    },
    Session: { getEffectiveUser: () => user(OWNER), getActiveUser: () => user(W.activeUser) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: k => (k in W.props ? W.props[k] : null),
      setProperty: (k, v) => { W.props[k] = String(v); },
      getProperties: () => ({ ...W.props }),
      deleteProperty: k => { delete W.props[k]; },
      deleteAllProperties: () => { W.props = {}; },
    }) },
    ScriptApp: {
      getProjectTriggers: () => W.triggers.slice(),
      deleteTrigger: t => { W.triggers = W.triggers.filter(x => x !== t); },
      newTrigger: trigBuilder,
    },
    MailApp: { sendEmail: (to, subject) => W.mails.push({ to, subject }) },
    console: { log: () => {}, error: e => { throw e; } },
    Date: FakeDate, Math, String, Number, Set, Object, Array, JSON, RegExp, Error,
  };
  vm.createContext(ctx);
  vm.runInContext(scriptPatch(SCRIPT), ctx);

  // ---------- running ----------
  function run(fn) {                      // one script execution
    W.exec = { buf: [] };
    let err = null;
    try { fn(); } catch (e) { err = e; }
    const late = W.exec.buf;              // commits after the NEXT run has read (worst case)
    W.exec = null;
    apply(W.deferred);
    W.deferred = late;
    if (err) throw err;
  }
  function settle() { apply(W.deferred); W.deferred = []; }
  const owner = name => { W.activeUser = OWNER; run(() => ctx[name]()); settle(); };

  // A person edits one cell (committed at once). paste: also wipes the cell's dropdown, as pasting does.
  // hideUser: Google does not tell the script who edited (e.user email is empty).
  function edit(email, sheetName, r, c, value, { paste = false, hideUser = false } = {}) {
    const sh = W.sheets[sheetName];
    if (!canEdit(email, sh, r, c)) return null;
    const rec = cellRec(sh, r, c);
    if (paste) rec.dv = null;
    if (rec.dv && !rec.dv.allowInvalid && value !== '' && !rec.dv.values().includes(value)) return null;
    const old = read(sh, r, c, 'v');
    apply([{ sh, r, c, field: 'v', value }]);
    return { range: new Range(sh, r, c), user: user(hideUser ? '' : email), oldValue: old === '' ? undefined : old, value };
  }
  function trigger(e) { run(() => ctx.onChoice(e)); }
  function stamp(e) {                     // the part of onChoice that runs before waiting for the lock
    const k = 'pending_' + e.range.getRow();
    if (!(k in W.props)) W.props[k] = String(++W.clock);
  }

  newSheet('Sheet1', FIXTURE.Sheet1);
  newSheet('Teams', FIXTURE.Teams);
  return { W, ctx, owner, edit, trigger, stamp, run, settle, canEdit };
}

// ---------- helpers for assertions ----------
function view(T) {
  T.settle();
  const sh = T.W.sheets.Sheet1, ts = T.W.sheets.Teams;
  const v = (s, r, c) => (s.cells.get(`${r},${c}`) || {}).v || '';
  const topics = [];
  for (let r = 1; r <= 40; r++) { const id = v(sh, r, 1).trim(); if (/^[A-Z]\d+$/.test(id)) topics.push({ r, id, label: `${id} ${v(sh, r, 2).trim()}`, slots: [v(sh, r, 3), v(sh, r, 4)] }); }
  const teams = [];
  for (let r = 2; r <= 40; r++) { const name = v(ts, r, 2).trim(); if (name) teams.push({ r, name, email: v(ts, r, 3).trim().toLowerCase(), choice: v(ts, r, 4), status: v(ts, r, 5) }); }
  return { topics, teams, team: n => teams.find(t => t.name === n), topic: id => topics.find(t => t.id === id) };
}

function checkConsistent(T, label) {
  const V = view(T);
  const seen = {};
  V.topics.forEach(t => {
    const names = t.slots.filter(Boolean);
    assert(names.length <= 2, `${label}: ${t.id} has more than 2 teams`);
    names.forEach(n => { assert(!seen[n.toLowerCase()], `${label}: ${n} placed twice`); seen[n.toLowerCase()] = t.id; });
  });
  const phase = T.W.props.PHASE;
  V.teams.forEach(t => {
    const placed = V.topics.find(tp => tp.slots.some(s => s.toLowerCase() === t.name.toLowerCase()));
    const D = 4;
    const leaderCan = T.canEdit(t.email, T.W.sheets.Teams, t.r, D);
    if (t.status === 'Locked') {
      assert(placed, `${label}: ${t.name} Locked but not in topic list`);
      assert.strictEqual(t.choice, placed.label, `${label}: ${t.name} choice cell does not match topic list`);
      assert(!leaderCan, `${label}: ${t.name} Locked but leader can still edit`);
    } else {
      assert(!placed, `${label}: ${t.name} is in topic list (${placed && placed.id}) but row says "${t.status}"`);
      assert.strictEqual(t.choice, '', `${label}: ${t.name} has a choice "${t.choice}" but is not Locked`);
      const wantAccess = (phase === 'prepared' || phase === 'open') && !t.status.startsWith('ERROR');
      assert.strictEqual(leaderCan, wantAccess, `${label}: ${t.name} leader access ${leaderCan}, expected ${wantAccess} (phase ${phase})`);
    }
  });
}

const results = [];
function test(name, fn) {
  try { fn(); results.push(['PASS', name]); }
  catch (e) { results.push(['FAIL', name, e.message]); }
}

// Shared fixture: fresh world, setup, all leaders shared as editors.
function fresh(opts) {
  const T = makeWorld(opts);
  view(T).teams.forEach(t => T.W.fileEditors.add(t.email));
  T.owner('setup');
  return T;
}
const ROW = n => view(globalT).team(n).r;
let globalT;
const D = 4;
const label = (T, id) => view(T).topic(id).label;

// ================= tests =================
test('setup: everything closed, statuses say when it opens', () => {
  const T = fresh(); globalT = T;
  const V = view(T);
  assert.strictEqual(T.W.props.PHASE, 'waiting');
  V.teams.forEach(t => assert.strictEqual(t.status, 'Opens at 11:00 AM'));
  V.teams.forEach(t => assert(!T.canEdit(t.email, T.W.sheets.Teams, t.r, D), t.name + ' can edit before prepare'));
  assert(T.W.triggers.some(t => t.getHandlerFunction() === 'onChoice'));
  checkConsistent(T, 'after setup');
});

test('prepare: each leader can edit only their own choice cell; topic list is owner-only', () => {
  const T = fresh(); globalT = T; T.owner('prepareLeaders');
  const V = view(T);
  V.teams.forEach(t => {
    assert(T.canEdit(t.email, T.W.sheets.Teams, t.r, D), t.name + ' cannot edit own cell');
    V.teams.filter(o => o !== t).slice(0, 3).forEach(o => assert(!T.canEdit(t.email, T.W.sheets.Teams, o.r, D), t.name + ' can edit row of ' + o.name));
    [1, 2, 3, 5].forEach(c => assert(!T.canEdit(t.email, T.W.sheets.Teams, t.r, c), t.name + ' can edit column ' + c));
    assert(!T.canEdit(t.email, T.W.sheets.Sheet1, 4, 3), t.name + ' can edit Sheet1');
  });
  checkConsistent(T, 'after prepare');
});

test('a choice before opening is refused and the cell stays open', () => {
  const T = fresh(); globalT = T; T.owner('prepareLeaders');
  const t = view(T).team('QUANTROX');
  const e = T.edit(t.email, 'Teams', t.r, D, label(T, 'A1'));
  assert(e, 'edit was blocked');
  T.trigger(e);
  const after = view(T).team('QUANTROX');
  assert.strictEqual(after.choice, '');
  assert(after.status.startsWith('Too early'), after.status);
  assert.strictEqual(view(T).topic('A1').slots.join(''), '');
  checkConsistent(T, 'early choice');
});

test('open: normal choice is accepted, locked and emailed', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('FSociety');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'C1')));
  const V = view(T);
  assert.strictEqual(V.team('FSociety').status, 'Locked');
  assert.deepStrictEqual(V.topic('C1').slots, ['FSociety', '']);
  assert.strictEqual(T.W.mails.length, 1);
  assert.strictEqual(T.edit(t.email, 'Teams', t.r, D, label(T, 'C2')), null, 'leader could change a locked choice');
  checkConsistent(T, 'normal choice');
});

test('3 leaders choose A1 at the same moment: first two in arrival order win, third refused', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const names = ['DEMO Team 3', 'DEMO Team 4', 'DEMO Team 5'];
  const evs = names.map(n => { const t = view(T).team(n); return T.edit(t.email, 'Teams', t.r, D, label(T, 'A1')); });
  evs.forEach(e => T.stamp(e));                 // all three arrived before any run got the lock
  [2, 0, 1].forEach(i => T.trigger(evs[i]));    // runs happen in a different order
  const V = view(T);
  assert.deepStrictEqual(V.topic('A1').slots, ['DEMO Team 3', 'DEMO Team 4']);
  assert.strictEqual(V.team('DEMO Team 5').status, 'A1 already has 2 teams: choose another topic');
  checkConsistent(T, 'three on A1');
});

test('the DEMO 4 bug: one team already on A1, two more choose it together', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t3 = view(T).team('DEMO Team 3');
  T.trigger(T.edit(t3.email, 'Teams', t3.r, D, label(T, 'A1')));
  const t4 = view(T).team('DEMO Team 4'), t5 = view(T).team('DEMO Team 5');
  const e4 = T.edit(t4.email, 'Teams', t4.r, D, label(T, 'A1'));
  const e5 = T.edit(t5.email, 'Teams', t5.r, D, label(T, 'A1'));
  T.trigger(e4); T.trigger(e5);
  const V = view(T);
  assert.deepStrictEqual(V.topic('A1').slots, ['DEMO Team 3', 'DEMO Team 4']);
  assert.strictEqual(V.team('DEMO Team 4').choice, label(T, 'A1'));
  assert.strictEqual(V.team('DEMO Team 4').status, 'Locked');
  assert.notStrictEqual(V.team('DEMO Team 5').status, 'Locked');
  checkConsistent(T, 'demo 4 bug');
});

test('the mock really reproduces the old bug when writes are not flushed', () => {
  const T = fresh({ noFlush: true }); globalT = T; T.owner('openSelection');
  const t3 = view(T).team('DEMO Team 3');
  T.trigger(T.edit(t3.email, 'Teams', t3.r, D, label(T, 'A1')));
  const t4 = view(T).team('DEMO Team 4'), t5 = view(T).team('DEMO Team 5');
  const e4 = T.edit(t4.email, 'Teams', t4.r, D, label(T, 'A1'));
  const e5 = T.edit(t5.email, 'Teams', t5.r, D, label(T, 'A1'));
  T.trigger(e4); T.trigger(e5);
  let broken = false;
  try { checkConsistent(T, 'no flush'); } catch (e) { broken = true; }
  assert(broken, 'without flush the simulation should show an inconsistency');
});

test('a leader changes the choice twice before it is processed: only the last one counts', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('NovaFive');
  const e1 = T.edit(t.email, 'Teams', t.r, D, label(T, 'A2'));
  const e2 = T.edit(t.email, 'Teams', t.r, D, label(T, 'B1'));
  T.stamp(e1); T.stamp(e2);
  T.trigger(e1); T.trigger(e2);
  const V = view(T);
  assert.deepStrictEqual(V.topic('B1').slots, ['NovaFive', '']);
  assert.strictEqual(V.topic('A2').slots.join(''), '');
  checkConsistent(T, 'changed twice');
});

test('a lost trigger is picked up by the 1-minute sweep', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  assert(T.W.triggers.some(t => t.getHandlerFunction() === 'sweep'));
  const t = view(T).team('Code Spark');
  T.edit(t.email, 'Teams', t.r, D, label(T, 'D3'));    // trigger never runs
  T.run(() => T.ctx.sweep()); T.settle();
  assert.strictEqual(view(T).team('Code Spark').status, 'Locked');
  checkConsistent(T, 'sweep');
});

test('a value that is not in the list is blocked (dropdown) and refused by the script if forced', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('Pentabyte');
  assert.strictEqual(T.edit(t.email, 'Teams', t.r, D, 'Z9 Something'), null, 'dropdown accepted an invalid value');
  T.W.sheets.Teams.cells.get(`${t.r},${D}`).dv = null;  // pretend the dropdown was bypassed
  T.trigger(T.edit(t.email, 'Teams', t.r, D, 'Z9 Something'));
  const after = view(T).team('Pentabyte');
  assert.strictEqual(after.choice, '');
  assert(after.status.startsWith('Invalid'), after.status);
});

test('owner cancels a team by deleting its choice cell', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('StackForge');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'C5')));
  T.trigger(T.edit(OWNER, 'Teams', t.r, D, ''));
  const V = view(T);
  assert.strictEqual(V.topic('C5').slots.join(''), '');
  assert.strictEqual(V.team('StackForge').status, 'Cancelled: choose again');
  assert(T.canEdit(t.email, T.W.sheets.Teams, t.r, D), 'leader cannot choose again');
  checkConsistent(T, 'owner cancel');
});

test('owner moves a team; a move to a full topic is refused and undone', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const pick = (n, id) => { const t = view(T).team(n); T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, id))); };
  pick('QUANTROX', 'A1'); pick('Syntax zero', 'A1'); pick('Code Scout', 'B2');
  const cs = view(T).team('Code Scout');
  T.trigger(T.edit(OWNER, 'Teams', cs.r, D, label(T, 'A1')));       // A1 is full
  let V = view(T);
  assert.deepStrictEqual(V.topic('B2').slots, ['Code Scout', '']);
  assert.strictEqual(V.team('Code Scout').choice, label(T, 'B2'));
  T.trigger(T.edit(OWNER, 'Teams', cs.r, D, label(T, 'C3')));       // free
  V = view(T);
  assert.strictEqual(V.topic('B2').slots.join(''), '');
  assert.deepStrictEqual(V.topic('C3').slots, ['Code Scout', '']);
  checkConsistent(T, 'owner move');
});

test('owner edits the topic list directly: removal reopens the team, typing a name moves it', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const pick = (n, id) => { const t = view(T).team(n); T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, id))); };
  pick('ASTRA-23', 'B3'); pick('Humpty Dumpty', 'C2');
  const b3 = view(T).topic('B3');
  T.trigger(T.edit(OWNER, 'Sheet1', b3.r, 3, ''));                   // remove ASTRA-23
  let V = view(T);
  assert.strictEqual(V.team('ASTRA-23').choice, '');
  assert.notStrictEqual(V.team('ASTRA-23').status, 'Locked');
  const d1 = view(T).topic('D1');
  T.trigger(T.edit(OWNER, 'Sheet1', d1.r, 4, 'Humpty Dumpty'));      // move Humpty Dumpty to D1
  V = view(T);
  assert.strictEqual(V.topic('C2').slots.join(''), '');
  assert.strictEqual(V.team('Humpty Dumpty').choice, label(T, 'D1'));
  checkConsistent(T, 'owner edits Sheet1');
});

test('unknown names left in the topic list are removed by repair', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const a2 = view(T).topic('A2');
  T.edit(OWNER, 'Sheet1', a2.r, 3, 'Old Team');                     // e.g. demo row deleted without cancelling
  T.owner('repair');
  assert.strictEqual(view(T).topic('A2').slots.join(''), '');
  checkConsistent(T, 'repair');
});

test('close: no more choices; locked rows stay; setup refuses while open', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  assert.throws(() => T.owner('setup'), /Selection is open/);
  const t = view(T).team('BUG SLAYER');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'E1')));
  T.owner('closeSelection');
  const V = view(T);
  assert.strictEqual(V.team('BUG SLAYER').status, 'Locked');
  const o = V.team('Devnexus');
  assert(!T.canEdit(o.email, T.W.sheets.Teams, o.r, D), 'leader can still edit after close');
  assert(!T.W.triggers.some(x => x.getHandlerFunction() === 'sweep'), 'sweep still running');
  checkConsistent(T, 'closed');
});

test('a leader who was not shared with gets an ERROR status at prepare', () => {
  const T = makeWorld(); globalT = T;
  view(T).teams.forEach(t => T.W.fileEditors.add(t.email));
  T.W.fileEditors.delete('rakibsami17@gmail.com');
  T.owner('setup'); T.owner('prepareLeaders');
  assert(view(T).team('QUANTROX').status.startsWith('ERROR: share the sheet'), view(T).team('QUANTROX').status);
  T.W.fileEditors.add('rakibsami17@gmail.com');
  T.owner('repair');
  assert.strictEqual(view(T).team('QUANTROX').status, 'Opens at 11:00 AM');
  checkConsistent(T, 'share error');
});

test('setup refuses duplicate team names or emails', () => {
  const T = makeWorld(); globalT = T;
  const ts = T.W.sheets.Teams;
  ts.cells.get('3,2').v = 'QUANTROX';
  assert.throws(() => T.owner('setup'), /appears on rows/);
});

test('only the owner can run the owner functions', () => {
  const T = fresh(); globalT = T;
  T.W.activeUser = 'rakibsami17@gmail.com';
  assert.throws(() => { T.run(() => T.ctx.openSelection()); }, /sheet owner/);
});

test('cancelTeam() works by name', () => {
  const T = makeWorld({ scriptPatch: s => s.replace("const TEAM_TO_CANCEL = '';", "const TEAM_TO_CANCEL = 'Code Scout';") });
  globalT = T;
  view(T).teams.forEach(t => T.W.fileEditors.add(t.email));
  T.owner('setup'); T.owner('openSelection');
  const t = view(T).team('Code Scout');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'B4')));
  T.owner('cancelTeam');
  assert.strictEqual(view(T).topic('B4').slots.join(''), '');
  checkConsistent(T, 'cancelTeam');
});

test('full run: all 27 teams choose at once (random topics, random run order)', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const T = fresh(); globalT = T; T.owner('openSelection');
    let x = seed;
    const rnd = n => { x = (x * 1103515245 + 12345) % 2147483648; return (x >>> 16) % n; };
    const V = view(T);
    const evs = V.teams.map(t => T.edit(t.email, 'Teams', t.r, D, V.topics[rnd(6)].label));   // crowd on 6 topics
    evs.forEach(e => T.stamp(e));
    const order = evs.map((e, i) => i).sort(() => rnd(3) - 1);
    order.forEach(i => { if (rnd(5)) T.trigger(evs[i]); });        // some triggers lost
    T.run(() => T.ctx.sweep());
    checkConsistent(T, 'crowd seed ' + seed);
    const placed = view(T).topics.slice(0, 6).reduce((a, t) => a + t.slots.filter(Boolean).length, 0);
    const wanted = V.topics.slice(0, 6).reduce((a, tp) => a + Math.min(2, evs.filter(e => e.value === tp.label).length), 0);
    assert.strictEqual(placed, wanted, 'seed ' + seed + ': every topic should be filled up to 2 from its choosers');
    assert.strictEqual(view(T).teams.filter(t => t.status === 'Locked').length, wanted, 'seed ' + seed + ': locked count');
    // arrival order respected: the 2 winners of each topic arrived before everyone refused there
    const stampOf = {}; evs.forEach((e, i) => { stampOf[V.teams[i].name] = i; });
    view(T).topics.slice(0, 6).forEach(tp => {
      const winners = tp.slots.filter(Boolean).map(n => stampOf[n]);
      V.teams.forEach((t, i) => {
        if (evs[i].value === tp.label && !tp.slots.includes(t.name)) winners.forEach(w => assert(w < i, `seed ${seed}: ${t.name} arrived earlier than a winner of ${tp.id}`));
      });
    });
  }
});

test('owner deletes a Locked cell even when Google hides who edited', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('DEMO Team 4');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'A1')));
  T.trigger(T.edit(OWNER, 'Teams', t.r, D, '', { hideUser: true }));
  const V = view(T);
  assert.strictEqual(V.topic('A1').slots.join(''), '');
  assert.strictEqual(V.team('DEMO Team 4').status, 'Cancelled: choose again');
  assert(T.canEdit(t.email, T.W.sheets.Teams, t.r, D));
  checkConsistent(T, 'hidden owner cancel');
});

test('owner pastes an email over a Locked choice: restored and the dropdown comes back', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  const t = view(T).team('DEMO Team 3');
  T.trigger(T.edit(t.email, 'Teams', t.r, D, label(T, 'B2')));
  T.trigger(T.edit(OWNER, 'Teams', t.r, D, 'dfahim432@gmail.com', { paste: true, hideUser: true }));
  const V = view(T);
  assert.strictEqual(V.team('DEMO Team 3').choice, label(T, 'B2'));
  assert(T.W.sheets.Teams.cells.get(`${t.r},${D}`).dv, 'dropdown not restored');
  checkConsistent(T, 'owner paste');
});

test('the broken sheet from the screenshot is cleaned by setup', () => {
  const T = makeWorld(); globalT = T;
  view(T).teams.forEach(t => T.W.fileEditors.add(t.email));
  const ts = T.W.sheets.Teams, r3 = view(T).team('DEMO Team 3').r, r4 = view(T).team('DEMO Team 4').r;
  ts.cells.set(`${r3},4`, { v: 'dfahim432@gmail.com' });                 // email pasted into the choice
  ts.cells.set(`${r4},4`, { v: '', bg: '#d9ead3', note: 'old note' });   // green, empty, old note
  view(T).teams.forEach(t => { ts.cells.set(`${t.r},5`, { v: 'Not yet chosen' }); });
  T.owner('setup');
  const V = view(T);
  assert.strictEqual(V.team('DEMO Team 3').choice, '');
  assert.strictEqual(ts.cells.get(`${r4},4`).bg, null);
  V.teams.forEach(t => { assert.strictEqual(t.status, 'Opens at 11:00 AM'); assert(ts.cells.get(`${t.r},4`).dv, 'no dropdown on ' + t.name); });
  checkConsistent(T, 'cleaned');
});

test('resetAllChoices() empties everything after a demo, but not while open', () => {
  const T = fresh(); globalT = T; T.owner('openSelection');
  ['DEMO Team 1', 'DEMO Team 2', 'QUANTROX'].forEach((n, i) => { const t = view(T).team(n); T.trigger(T.edit(t.email, 'Teams', t.r, D, view(T).topics[i].label)); });
  assert.throws(() => T.owner('resetAllChoices'), /closeSelection/);
  T.owner('closeSelection');
  T.owner('resetAllChoices');
  const V = view(T);
  V.topics.forEach(tp => assert.strictEqual(tp.slots.join(''), ''));
  V.teams.forEach(t => assert.strictEqual(t.status, 'Selection closed'));
  checkConsistent(T, 'reset');
});

// ---------- report ----------
results.forEach(r => console.log(r[0] + '  ' + r[1] + (r[2] ? '\n      ' + r[2] : '')));
const failed = results.filter(r => r[0] === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
