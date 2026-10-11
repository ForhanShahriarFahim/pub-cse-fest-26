# HackerRank contest setup (PUB CSE Fest-26)

The date below is a **placeholder** (after the fest). Change it once the real date is fixed.

## Page 1: Create Contest

| Field | Value |
|---|---|
| Contest Name | `PUB CSE Fest-26 Programming Contest` |
| Start Time | **31 Dec 2026** at **10:00 AM** BDT (placeholder) |
| End Time | **31 Dec 2026** at **12:30 PM** BDT (2 h 30 min after the start) |
| "This contest has no end time" | leave **unticked** |
| Organization Type | the university / college option in the list |
| Organization Name | `Pundra University of Science & Technology` |

Click **Save as Draft**, not *Create & Publish*: publishing makes the landing page
public before the problems are ready.

## Page 2: Contest details

Background image: upload `contest/banner.png` (1920 × 480). HackerRank prints the
contest name, date and Sign Up button in the middle, so the banner keeps the middle
clear and puts the fest logo on the right. `contest/banner-preview.png` shows the
expected result. Regenerate with `python3 contest/draw_banner.py`.

HackerRank shows these sections **centered**, so they are written as short
paragraphs (one blank line between them) instead of bullet lists, which look ragged
when centered.

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

Twelve years ago, PUB CSE wrote its very first line of code. Since then, class after class has learned to think in loops, debug late into the night and turn ideas into working programs.

**PUB CSE Fest-26** celebrates that journey, and the programming contest is where it comes alive.

**Teams of 3  ·  2 hours 30 minutes  ·  11 problems  ·  C, C++, Java, Python 3**

Every team includes a first-year student, because the next twelve years begin with them.

Every problem is written specially for this fest, from friendly warm-ups to a couple of tough challenges for the brave.

The problems are **not** sorted by difficulty, so read them all and choose your battles wisely.

**ICPC rules:** a problem counts only when it passes every test case. Teams are ranked by problems solved, then by penalty time.

Onsite in the PUB CSE labs. No internet, no AI tools: just your team, your code and twelve years of PUB CSE spirit.

Whether you are writing your very first program or chasing your next "Accepted", this is your stage.

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
```

## Advanced Settings tab: Leaderboard Configurations

| Field | Value |
|---|---|
| Leaderboard | **ACM Leaderboard** |
| Penalty (in seconds) | **1200** (20 minutes) |
| Penalize Compilation Error | **unticked** (ICPC does not penalize compile errors) |
| Freeze Leaderboard at | **leave empty for now**; fill it in once the date is fixed (see below) |
| Tiebreaker | keep **Sum of time of the first (accepted) submissions** |
| Time Used for Tiebreaking | keep **Start of the Contest** |
| Hide Challenge Difficulty Tags | **ticked** (the problems are shuffled, as in ICPC) |

Then click **Save Draft**, not *Publish*.

### Freeze time (only once the real date is fixed)

"Freeze Leaderboard at" takes a **Unix timestamp** (seconds since 1970-01-01 UTC).
Freeze 30 minutes before the end, i.e. at 2:00 into the 2:30 contest. BDT is UTC+6.

For the placeholder date it would be:

| Moment (BDT) | Unix time |
|---|---|
| Start: 31 Dec 2026, 10:00 | 1798689600 |
| Freeze: 31 Dec 2026, 12:00 | 1798696800 |
| End: 31 Dec 2026, 12:30 | 1798698600 |

For the real date, compute it in Python, replacing the date and time:

```
python3 -c "from datetime import *; print(int(datetime(2026,12,31,12,0,tzinfo=timezone(timedelta(hours=6))).timestamp()))"
```

Do not leave a placeholder freeze time in place: if the real contest is later than
that moment, the leaderboard would be frozen from the very start.

## When adding the challenges (Challenges tab)

- Give every challenge the same max score (100).
- Order: the two giveaways (01 Welcome, 02 Fest T-Shirts) first, the rest shuffled.
