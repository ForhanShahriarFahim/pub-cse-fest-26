# Hackathon Topic Selection: Runbook

How the PUB CSE Fest-26 Hackathon topic selection works, how to set it up from scratch,
how to run it on the day, and what to do when something goes wrong. Written so the same
process can be repeated later (next fest, another event) or continued in a new session.

---

## 1. Quick facts

| Item | Value |
|---|---|
| Owner account (does every setup step) | `fahim.cse.pub@gmail.com` |
| Google Sheet | "PUB CSE FEST-26 Hackathon Team Selection" (native Google Sheet, green icon, has an **Extensions** menu) |
| Sheet ID | `1Cx61jRQ8gxCvFCnceHS7rpjh580ss99UTGtZ3iGs8ps` |
| Sheet link | https://docs.google.com/spreadsheets/d/1Cx61jRQ8gxCvFCnceHS7rpjh580ss99UTGtZ3iGs8ps/edit |
| Script | Standalone Apps Script project at script.google.com (owner's Drive), code = `topic_lock.gs` |
| Teams | 22 teams, 5 students each; one leader email per team |
| Topics | 19 problems (A1–E3), **at most 2 teams per topic**, first come first served |
| Selection time text | "11:00 AM" (setting `OPENS_AT` in the script) |

## 2. Files in this folder

| File | Purpose |
|---|---|
| `topic_lock.gs` | The script. Paste into a standalone project at script.google.com. |
| `PUB_CSE_Fest_2026_Hackathon_Topic_selection.xlsx` | Import file: topic list (Sheet1) + **22 real teams** (Teams). |
| `PUB_CSE_Fest_2026_Hackathon_Topic_selection_WITH_DEMO.xlsx` | Same + 5 DEMO rows, for testing. |
| `test/topic_lock.test.js` | Simulation tests of the script (run `node hackathon/test/topic_lock.test.js`). |
| `test/fixture.json` | Data used by the tests (exported from the WITH_DEMO workbook). |
| `PUB_CSE_Fest-26_Hackathon_Problem_Set.docx/.pdf` | The problem set (built by `build_docx.js` from `content.js`). |

## 3. How it works (design)

**Sheets inside the Google Sheet**

| Sheet | Columns | Who can edit |
|---|---|---|
| `Sheet1` (topic list) | A = ID (A1…E3), B = topic, C = Team 1, D = Team 2, E = count | Owner only; the script fills C/D |
| `Teams` | A #, B Team Name, C Leader Email, **D Choose Topic**, E Status | Each **D cell only by that row's leader** (Google range protection); rest owner only |
| `Lists` (hidden) | Topic labels used by the dropdown | Owner only (created by `setup`) |
| `Log` (hidden) | Every action with time and who | Owner only (created by `setup`) |

**Rules the script enforces**
- `Sheet1` is the **single source of truth**; each Teams row is corrected to match it after every run.
- Max 2 teams per topic. Simultaneous choices are processed **one at a time, in arrival order**.
- Once a choice is accepted: cell turns green, status **Locked**, the leader loses edit access, a confirmation email is sent.
- Choices before `openSelection` are refused ("Too early…"); after `closeSelection` nobody can choose.
- Owner can cancel or move any team (delete or change the D cell, or edit Sheet1).
- A 1-minute safety run (`sweep`) picks up any choice whose trigger failed.

**Phases** (stored in the script's properties)

| Phase | Set by | Leaders can edit their cell? | Choices accepted? | Status text |
|---|---|---|---|---|
| waiting | `setup` | No | No | Opens at 11:00 AM |
| prepared | `prepareLeaders` | Yes | No (refused "Too early") | Opens at 11:00 AM |
| open | `openSelection` | Yes | **Yes** | Open: choose your topic |
| closed | `closeSelection` | No | No | Selection closed |

**Why a standalone script (not Extensions > Apps Script):** editors of a sheet can open and change
a script attached to it, and that script runs with the owner's permissions. Leaders are editors,
so the script must live privately in the owner's Drive and reach the sheet by its ID.

## 4. Script functions (choose in the function list, click Run)

| Function | When |
|---|---|
| `setup` | First time, and after changing teams/topics. Refuses to run while open. |
| `prepareLeaders` | ~10 minutes before the start. Gives each leader access to their own cell. |
| `openSelection` | At the start time. Choices count from this moment. |
| `closeSelection` | When done. |
| `repair` | Any time something looks wrong; also after sharing with a leader who showed ERROR. |
| `cancelTeam` | Alternative cancel: set `TEAM_TO_CANCEL = 'Team name'`, save, run, then set it back to `''`. |
| `resetAllChoices` | Clears every choice and the topic list (e.g. after a demo). Not while open. |
| `status` | Prints a summary to the execution log. |
| `onChoice`, `sweep` | **Never run by hand.** They run automatically. |

## 5. Setup from scratch

1. **Prepare the data** in the import `.xlsx`: Sheet1 topic rows (ID in column A, topic in B);
   Teams rows (# , team name, leader email; D empty; E "Opens at 11:00 AM"). No duplicate team
   names or emails (setup checks this and stops with a list of problems).
2. **Create/open the Google Sheet** (not an `.xlsx` opened in Drive; an `.xlsx` has no Extensions
   menu and scripts do not work on it).
3. **Import**: File > Import > Upload the `.xlsx` > **Replace spreadsheet** > Import data.
4. **Remove any script attached to the sheet**: Extensions > Apps Script > Triggers (clock icon) >
   delete every trigger; then delete the code and save. (Two scripts reacting to edits will fight.)
5. **Create the standalone script**: script.google.com > New project > rename it
   (e.g. "Hackathon Topic Selection") > paste `topic_lock.gs` > set
   `SPREADSHEET_ID = '<ID from the sheet URL>'` (the part between `/d/` and `/edit`) > Save.
6. **Sharing** (sheet > Share):
   - Gear icon: **untick "Allow editors to change permissions and share"**.
   - Add the leader emails as **Editor**, **untick "Notify people"**. General access: **Restricted**.
7. **Run `setup`** as the owner. First run asks for permissions: Review permissions > owner account >
   Advanced > Go to project > Allow. Expected log:
   ```
   Spreadsheet: PUB CSE FEST-26 Hackathon Team Selection
   Phase: waiting
   Teams: 22, locked: 0, not yet: 22
   ```
   In the sheet: every status "Opens at 11:00 AM", a dropdown arrow in every D cell.

## 6. Test before the real run (recommended)

1. Import the **WITH_DEMO** `.xlsx` (Replace spreadsheet), share with the demo emails, run `setup`.
2. Run `prepareLeaders`, then `openSelection` (you can test any time; "11:00 AM" is only text).
   Teams that are not shared show `ERROR: share the sheet with …`; that is expected during a test.
3. In incognito windows, one per demo account, open the sheet > Teams > own row > pick a topic.

| Test | Expected |
|---|---|
| 3 demo accounts pick the same topic at once | 2 Locked (green) and listed in Sheet1; 1 shows "… already has 2 teams: choose another topic" |
| A demo account clicks another team's D cell or Sheet1 | Blocked (protected cell) |
| A Locked account tries to change | Blocked |
| Owner clicks a Locked D cell and presses **Delete** | Team removed from Sheet1, status "Cancelled: choose again", leader can choose again |
| Owner picks another topic in a team's D cell | Team moves in Sheet1 (refused if full) |

4. Clean up: run `closeSelection` > `resetAllChoices` > import the **real** `.xlsx` (Replace) >
   remove demo emails from Share > run `setup` (log shows the real team count, locked 0).

## 7. On the day

| Time | Action |
|---|---|
| 10:50 | Run `prepareLeaders`. The log must have **no ERROR lines**. If one appears: share the sheet with that email (Editor), then run `repair`. |
| 10:59 | Copy the sheet link; have the announcement ready. |
| 11:00 | Run `openSelection`; when "Execution completed" appears, post the announcement. |
| During | Watch the Teams tab; run `status` for a summary. |
| End | When every row shows Locked, run `closeSelection`. |

**Early notice (optional, may be posted before 11:00)**
> **Hackathon Topic Selection opens at 11:00 AM today.**
> Sheet link: <link>
> Open it with your registered Gmail and find your team's row in the **Teams** tab. Choices made before 11:00 AM will be refused.

**Opening announcement (post only after `openSelection`)**
> **Hackathon Topic Selection is now open.**
> 1. Open the sheet with your registered Gmail (team leaders only): <link>
> 2. Go to the **Teams** tab and find your team's row.
> 3. Pick your topic from the dropdown in **column D**.
> 4. Wait a few seconds until your status shows **Locked**. You will also get a confirmation email.
> 5. If it says the topic is full, choose another one.
>
> Maximum 2 teams per topic, first come first served. Choices are final once Locked.

## 8. Owner actions during selection

| Need | Do |
|---|---|
| Cancel a team's choice | Left-click its column D cell, press the **Delete** key, wait 5–10 s. |
| Move a team to another topic | Pick the new topic from its D-cell dropdown (refused if that topic is full). |
| Cancel does not work | Set `TEAM_TO_CANCEL`, save, run `cancelTeam`, set it back to `''`. |
| A choice is stuck (not green after ~2 min) | Run `repair`. |
| Leader shows ERROR | Share the sheet with that email as Editor, run `repair`. |
| Find out who did what | Sheet > View > Hidden sheets > **Log**; or right-click a cell > Show edit history. |

**Do not** (on column D): right-click > Delete cells / Delete row / Insert / Cut / Paste.
Do not rename teams, delete rows, or run `setup` while selection is open.

## 9. Troubleshooting (problems met while building this, and their fixes)

| Symptom | Cause | Fix |
|---|---|---|
| Statuses say "Not yet chosen" | An **old** version of the script ran; the new one never set up this sheet | Remove the old attached script's triggers/code (step 5.4); run `setup` from the standalone project |
| `setup` says "Cannot open the spreadsheet" | Wrong `SPREADSHEET_ID`, the ID of an `.xlsx`, or not run as owner | Use the Google Sheet's ID; sign in as the owner |
| `setup` says "Run this as the sheet owner" | Script run from another Google account | Switch to `fahim.cse.pub@gmail.com` |
| A cell shows an email/text and no dropdown arrow | Something was **pasted** into column D (pasting removes the dropdown) | Run `repair` (restores dropdowns and clears invalid values) |
| Locked in Teams but missing in Sheet1 (old DEMO 4 bug) | Old script read the sheet before the previous run had saved | Fixed: each run saves (`flush`) before the next starts; `repair` corrects any mismatch |
| Owner's delete of a Locked cell was undone | Google did not tell the old script who edited | Fixed: edits to Locked cells / Sheet1 / while leaders have no access are treated as the owner's |
| Everyone shows ERROR after `prepareLeaders` | Sheet not shared with those emails yet | Share as Editor, run `repair` |

## 10. Reusing for another event

1. Edit the `.xlsx`: new topics in Sheet1 (ID in A, title in B), new teams in Teams.
2. If needed, change settings at the top of `topic_lock.gs`:
   `OPENS_AT`, `TEAM_COLS` (number of teams per topic = number of columns), `ID_PATTERN`,
   `SEND_CONFIRMATION_EMAIL`.
3. Follow sections 5–7. Run `closeSelection` and `resetAllChoices` on the old data first, or
   create a fresh Google Sheet and a fresh script project.
4. After changing the script, run the simulation tests: `node hackathon/test/topic_lock.test.js`
   (regenerate `test/fixture.json` from the new workbook if the data changed).

## 11. Starting a new Claude session

Tell Claude: *"Read `hackathon/TOPIC_SELECTION_RUNBOOK.md` and `hackathon/topic_lock.gs` in the
pub-cse-fest-26 repo; I want to [run / change / debug] the hackathon topic selection."*
Useful context to include: the current phase (from `status`), a screenshot of the Teams tab and
Sheet1, and any error text from the execution log.
