# Hackathon topic selection: setup and run guide

Owner account for every step: **fahim.cse.pub@gmail.com**

## Files

| File | Use |
|---|---|
| `PUB_CSE_Fest_2026_Hackathon_Topic_selection_WITH_DEMO.xlsx` | 22 teams + 5 DEMO rows. Import this first, for the test. |
| `PUB_CSE_Fest_2026_Hackathon_Topic_selection.xlsx` | 22 real teams only. Import this for the real selection. |
| `topic_lock.gs` | The script. Lives at script.google.com, not inside the sheet. |

## A. One-time setup

1. **Use the Google Sheet**, not the `.xlsx` file in Drive. The Google Sheet is the one with the
   green icon and an **Extensions** menu ("PUB CSE FEST-26 Hackathon Team Selection").
2. **Remove the old script from that Google Sheet.** Extensions > Apps Script > Triggers (clock icon)
   > delete every trigger. Then delete all the code there and save. Close that tab.
3. **Import the data.** In the Google Sheet: File > Import > Upload the `..._WITH_DEMO.xlsx`
   > **Replace spreadsheet** > Import data.
4. **Copy the sheet ID** from the address bar: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.
5. **Create the script.** Open script.google.com > New project. Delete the sample code, paste
   `topic_lock.gs`, and put the ID into `SPREADSHEET_ID = '...'`. Save.
6. **Share settings.** In the sheet: Share > gear icon > untick "Editors can change permissions and share".
   Add the leader emails (and the 5 demo emails for the test) as **Editor**, untick "Notify people".
7. **Run `setup`** (choose it in the function list at the top, click Run, allow the permissions;
   if Google says the app is unverified: Advanced > Go to project).
   - Execution log shows `Spreadsheet: PUB CSE FEST-26 Hackathon Team Selection` and `Phase: waiting`.
   - In the sheet, every status says **Opens at 11:00 AM** and every column D cell has a dropdown.

## B. Demo test

1. Run `prepareLeaders`. Each demo account can edit only its own column D cell.
2. Run `openSelection`.
3. DEMO 1, 2 and 3 pick **A1** at the same moment: two show **Locked** (green) and appear in Sheet1;
   one shows "A1 already has 2 teams: choose another topic".
4. As owner, **delete** one Locked cell: the team disappears from Sheet1 and the cell reopens.
5. As owner, pick a different topic in a team's cell: the team moves in Sheet1.
6. Run `status` to see the summary in the execution log.

## C. Switch to the real selection

1. Run `closeSelection`, then `resetAllChoices`.
2. In the Google Sheet: File > Import > Upload the **22-team** `.xlsx` > Replace spreadsheet.
3. Remove the 5 demo emails from Share. Check the 22 leader emails are Editors.
4. Run `setup`.

## D. On the day

| Time | Action |
|---|---|
| 10:50 | Run `prepareLeaders`. Every status must say "Opens at 11:00 AM". A red "ERROR: share the sheet with ..." means share with that email, then run `repair`. |
| 11:00 | Run `openSelection`, then post the announcement. |
| During | Watch the sheet. The 1-minute safety run handles any stuck choice. `status` shows the summary. |
| End | Run `closeSelection` when every team shows Locked. |

## Owner actions at any time

- **Cancel a team:** delete its column D cell (or set `TEAM_TO_CANCEL` and run `cancelTeam`).
- **Move a team:** pick the new topic in its column D cell (refused if the topic is full).
- **Something looks wrong:** run `repair`.
- Do not paste into column D, do not rename teams, and do not run `setup` while selection is open.
- Every action is recorded in the hidden **Log** sheet (View > Hidden sheets).
