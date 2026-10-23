# HackerRank contest setup (PUB CSE Fest-26)

## Page 1: Create Contest

| Field | Value |
|---|---|
| Contest Name | `PUB CSE Fest-26 Programming Contest` |
| Start Time | **30 Oct 2026** at **10:00 AM** BDT |
| End Time | **30 Oct 2026** at **1:00 PM** BDT (3 hours after the start) |
| "This contest has no end time" | leave **unticked** |
| Organization Type | the university / college option in the list |
| Organization Name | `Pundra University of Science & Technology` |

Click **Save as Draft**, not *Create & Publish*: publishing makes the landing page
public before the problems are ready.

## Page 2: Contest details

Background image: upload `contest/banner-v3.png` (1920 × 640, a copy of `banner.png`
under a new name so browsers do not show a cached old banner). HackerRank prints the
contest name, date and Sign Up button in the middle and crops the image from the right
on narrower windows, so the banner keeps the middle clear, puts the fest logo on the
left and the code symbols on the right. `contest/banner-preview.png` shows the expected
result on a 1280 px wide window. Regenerate with `python3 contest/draw_banner.py`.

HackerRank shows the Description (About) **centered**, so it is written as short
paragraphs (one blank line between them). Prizes, Rules and Scoring are left-aligned.

Contest URL (slug):
```
pub-cse-fest-26
```

Tagline:
```
Celebrating 12 years of PUB CSE  ·  Code. Compete. Celebrate.
```

Description:
```
**Celebrating 12 years of PUB CSE!**

The programming contest of **PUB CSE Fest-26**: teams of three, 3 hours, 10 problems.

From friendly warm-ups to a couple of tough challenges, read every problem and choose your battles wisely.

**Code. Compete. Celebrate.**
```

Prizes:
```
**Exciting prizes are on the way!**

The prizes for the top teams of the PUB CSE Fest-26 Programming Contest will be announced very soon.

Stay tuned, keep practising, and get ready to compete for them.

**Code. Compete. Celebrate.**
```

Rules:
```
**Teams:** exactly three members, including one 1st-year student. Each team competes from one HackerRank account in the PUB CSE lab.

**Languages:** C, C++, Java and Python 3. In Java, the class must be named **Solution**.

**Input and output:** read from standard input and write to standard output, exactly in the format the problem asks for. Do not print extra messages such as "Enter a number".

**Fair play:** no internet other than this contest page, no AI tools, and no talking to other teams. Mobile phones must be switched off during the contest.

**Questions:** if a statement is unclear, raise your hand and ask a judge. Judges will only clarify the statement; they will not help with solutions.

**Respect the spirit of the fest:** any form of cheating leads to disqualification, and the judges' decision is final.
```

Scoring:
```
**ICPC style:** a problem is solved only when a submission passes **all** of its test cases. There is no partial credit.

**Ranking:** teams are ranked by the **number of problems solved**. Teams with the same number are ranked by **penalty time**, and less is better.

**Penalty time:** for each solved problem, the minutes from the start of the contest to its accepted submission, plus **20 minutes** for every wrong submission on that problem before it was accepted.

**Example:** a team solves a problem at minute 35 after 2 wrong submissions. That problem adds 35 + 2 × 20 = **75** penalty minutes.

**Free mistakes:** wrong submissions on problems you never solve cost nothing, and compilation errors cost nothing.

**Frozen leaderboard:** the leaderboard freezes **30 minutes before the end** of the contest. During the last 30 minutes you still see your own verdicts, but the public standings stop changing. The final standings are revealed at the prize-giving ceremony.
```

## Advanced Settings tab: Leaderboard Configurations

| Field | Value |
|---|---|
| Leaderboard | **ACM Leaderboard** |
| Penalty (in seconds) | **1200** (20 minutes) |
| Penalize Compilation Error | **unticked** (ICPC does not penalize compile errors) |
| Freeze Leaderboard at | **1793341800** (30 Oct 2026, 12:30 PM BDT, see below) |
| Tiebreaker | keep **Sum of time of the first (accepted) submissions** |
| Time Used for Tiebreaking | keep **Start of the Contest** |
| Hide Challenge Difficulty Tags | **ticked** (the problems are shuffled, as in ICPC) |

Then click **Save Draft**, not *Publish*.

### Freeze time

"Freeze Leaderboard at" takes a **Unix timestamp** (seconds since 1970-01-01 UTC).
Freeze 30 minutes before the end, i.e. at 2:30 into the 3-hour contest. BDT is UTC+6.

| Moment (BDT) | Unix time |
|---|---|
| Start: 30 Oct 2026, 10:00 | 1793332800 |
| Freeze: 30 Oct 2026, 12:30 | 1793341800 |
| End: 30 Oct 2026, 13:00 | 1793343600 |

If the date or time changes, recompute it in Python, replacing the date and time:

```
python3 -c "from datetime import *; print(int(datetime(2026,10,30,12,30,tzinfo=timezone(timedelta(hours=6))).timestamp()))"
```

Keep the freeze time in step with the start time: if the contest moves later than the
freeze moment, the leaderboard would be frozen from the very start.

## When adding the challenges (Challenges tab)

- Give every challenge the same max score (100).
- Order: the two giveaways (01 Welcome, 02 Fest T-Shirts) first, the rest shuffled.
