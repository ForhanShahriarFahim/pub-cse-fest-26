// Problem-set content. Each software problem must fit on one A4 page.
// Feature entries: a string is a numbered feature; { module: "..." } starts a sub-heading.

const TRACKS = {
  A: "Track A: Blockchain and Cybersecurity",
  B: "Track B: Artificial Intelligence and Machine Learning",
  C: "Track C: Smart Campus Services",
  D: "Track D: Academic and EdTech Platforms",
  E: "Track E: Animated Short Film",
};

const PROBLEMS = [
  {
    id: "A1", track: "A", name: "PUB CertChain",
    subtitle: "Blockchain-Based Academic Certificate Verification",
    description:
      "Employers, foreign universities and scholarship boards usually verify a graduate's certificate by emailing the Registrar's office or by checking a scanned copy, which is slow and makes forged certificates hard to detect. Build a system in which the university issues digitally verifiable certificates and transcripts, records their fingerprints on a blockchain, and allows anyone to check a certificate within seconds without contacting the university.",
    features: [
      "Secure login for university staff. Only issuer accounts registered in the smart contract can issue or revoke certificates.",
      "Create student records and certificates (degree certificate, provisional certificate, transcript), each with a unique certificate ID, and generate the certificate as a PDF.",
      "Compute a cryptographic hash (e.g. SHA-256) of the certificate and store the hash, certificate ID, issuer and issue date in a smart contract.",
      "Print a QR code on every certificate that opens the verification page for that certificate.",
      "Public verification page: verify by certificate ID, by scanning the QR code, or by uploading the PDF. The system recomputes the hash and compares it with the on-chain record.",
      "Show a clear result: Valid, Invalid (modified or not found) or Revoked, together with the issuing authority and issue date.",
      "Revoke a certificate with a recorded reason. A revoked certificate stays on the chain but always verifies as Revoked.",
      "Batch issuance for a full graduating batch from a CSV file.",
      "Student portal to view own certificates and share a time-limited verification link with an employer.",
      "Audit trail of every issue, revoke and verification event, with the blockchain transaction hash.",
    ],
    roles: [
      ["Controller of Examinations", "Approves issuer accounts; co-signs revocations."],
      ["Registrar / Issuer", "Creates, issues, batch-uploads and revokes certificates."],
      ["Student", "Views own certificates and shares verification links."],
      ["Verifier (employer, university)", "Verifies a certificate without creating an account."],
    ],
    restrictions: [
      "Do not store the certificate file or personal data (name, grades, contact) on the blockchain; store only hashes and references.",
      "Use a local or public test network (e.g. Hardhat, Ganache, Sepolia). No real cryptocurrency is required.",
      "The demonstration must show that changing even one character of a certificate makes verification fail.",
    ],
    optional:
      "Multi-signature issuance, re-issue with version history after correction, encrypted off-chain storage (e.g. IPFS), verification statistics, W3C Verifiable Credentials format.",
  },
  {
    id: "A2", track: "A", name: "PUB Helping Hand",
    subtitle: "Blockchain-Based Transparent Fundraising and Student Assistance Platform",
    description:
      "When a student faces a medical emergency, cannot pay tuition, or is affected by a flood, help is usually collected informally through social media, and donors never see how the money was spent. Clubs raise funds for events in the same way. Build a platform where verified campaigns are created for students and university causes, every donation and expense is recorded on a blockchain, and spending rules are enforced by smart contracts instead of trust.",
    features: [
      "Campaign request with category (medical, tuition, disaster relief, club or event, charity), target amount, deadline and supporting documents stored off-chain.",
      "Verification workflow: a committee checks each request before it is published; verified campaigns carry a badge.",
      "Emergency fund request with a shorter review window and higher listing priority.",
      "Donations through simulated payment or test tokens. Every donation is recorded on the chain and the donor receives a receipt with the transaction hash.",
      "Public campaign page showing target, amount raised, number of donors, current balance and the full transaction history.",
      "Spending requests by the campaign owner with purpose, amount and evidence (bills, receipts).",
      "The smart contract releases funds only after approval by at least k of n committee members, and blocks spending above the available balance and duplicate claims.",
      "Campaign closing with a final report (raised, spent, remaining) and a defined rule for the remaining balance: refund to donors or transfer to a general welfare fund.",
      "Donor dashboard showing donation history and how each donation was used.",
      "Campaign priority ranking based on urgency, deadline and funding gap, and an analytics view for administrators.",
    ],
    roles: [
      ["Campaign Owner / Beneficiary", "Requests a campaign, submits spending requests with evidence."],
      ["Donor", "Donates, tracks the use of donations, downloads receipts."],
      ["Verification Committee", "Verifies campaigns and approves or rejects spending requests."],
      ["Administrator / Auditor", "Manages users and categories; views all records and reports."],
    ],
    restrictions: [
      "No real money may be collected; use simulated payments or a test network.",
      "Personal, medical and financial details must not be stored on the chain. A beneficiary may choose to stay anonymous on the public page.",
      "Spending rules must be enforced in the smart contract, not only in the user interface.",
    ],
    optional:
      "Automatic refund when the target is not reached, milestone-based fund release, QR donation receipts, donor-selected spending purpose, matching funds from sponsors.",
  },
  {
    id: "A3", track: "A", name: "PUB PhishGuard",
    subtitle: "Phishing Detection and Awareness Platform",
    description:
      "Students and staff regularly receive fake scholarship offers, mobile-banking reward messages, fake job letters and links to pages that imitate university or bank login portals. Build a system that analyses a suspicious URL, email or SMS, estimates how likely it is to be phishing, explains the reasons, and helps users learn to recognise phishing themselves.",
    features: [
      "Accept three kinds of input: a URL, a full email (pasted with headers or uploaded as .eml), and SMS or chat text.",
      "URL analysis: length, IP address as host, '@' symbol, number of subdomains, punycode and look-alike characters, suspicious top-level domains and URL shorteners.",
      "Typosquatting check against a list of legitimate domains (e.g. the university, local banks and mobile financial services).",
      "Email analysis: sender and reply-to mismatch, display-name spoofing, SPF/DKIM/DMARC results from the headers, urgency and credential-request wording, risky attachments (double extensions, macro files).",
      "Keyword detection in both Bangla and English for SMS and message scams.",
      "A machine-learning classifier trained on a public phishing dataset, combined with the rule-based indicators. Report accuracy, precision, recall and F1-score on a held-out test set.",
      "Risk score from 0 to 100 mapped to Low, Medium or High.",
      "An explanation that lists every indicator that contributed to the result.",
      "Awareness module: a quiz built from synthetic phishing and genuine examples, with feedback after each answer and score history.",
      "Admin dashboard with scan history, most frequent indicators, and allow-list / block-list management.",
    ],
    roles: [
      ["User (student or staff)", "Submits items for analysis, takes awareness quizzes."],
      ["Security Administrator", "Manages lists and datasets, reviews scan history and statistics."],
    ],
    restrictions: [
      "Use only public, provided or synthetic datasets. Do not send phishing messages to real people.",
      "Do not collect real passwords or credentials and do not build copies of real login pages.",
      "Do not open live suspicious links on the demonstration machine; use stored page data or an isolated sandbox.",
    ],
    optional:
      "Browser extension, QR-code phishing detection, explainable AI (SHAP or LIME), email-client plug-in, a simulated phishing exercise for consenting team members only.",
  },
  {
    id: "A4", track: "A", name: "PUB MediVault",
    subtitle: "Secure Digital Health Record and Consent Management",
    description:
      "Patients carry paper prescriptions and test reports from one doctor to another. Records are lost, and when they are shared through messaging apps there is no control over who sees them. Build a platform where patients own their health records, grant and withdraw access for doctors and hospitals, and every access is written to a tamper-evident audit trail.",
    features: [
      "Registration for patients, doctors (with registration number checked by the administrator) and hospitals or diagnostic centres.",
      "Upload and organise records by type: prescription, lab report, imaging, discharge summary, vaccination; each with date, provider and tags.",
      "Encrypt records at rest; encryption keys must not be stored alongside the data.",
      "Consent management: the patient grants a doctor or hospital access to selected record types for a chosen period and can withdraw access at any time.",
      "Doctors see only the records they have consent for, and can add prescriptions and clinical notes to the patient's history.",
      "Emergency (break-glass) access to a minimal profile (blood group, allergies, chronic conditions, current medication). A reason is mandatory and the patient is notified.",
      "Record the hash of every record and every grant, withdrawal and access event on a blockchain ledger.",
      "Integrity check that detects whether a stored record was changed after upload.",
      "QR health card that shows the emergency profile and lets a doctor send an access request.",
      "Patient timeline of the full medical history, plus an access log showing who viewed what and when.",
    ],
    roles: [
      ["Patient", "Uploads records, grants and withdraws consent, views the access log."],
      ["Doctor", "Views consented records, adds prescriptions and notes, requests access."],
      ["Hospital / Diagnostic Centre", "Uploads test reports and discharge summaries for a patient."],
      ["Administrator", "Verifies doctors and institutions; cannot read record contents."],
    ],
    restrictions: [
      "Use synthetic patient data only. No medical data on the blockchain; only hashes and consent events.",
      "Access control must be enforced on the server and all traffic must use HTTPS.",
    ],
    optional:
      "HL7 FHIR data format, family or guardian access, medicine reminders, OCR for handwritten prescriptions, doctor appointment booking.",
  },
  {
    id: "B1", track: "B", name: "PUB NoticeLens",
    subtitle: "AI-Powered Bengali/English Notice and Document Intelligence",
    description:
      "University notices arrive as scanned PDFs, photos shared in Facebook groups and printouts on notice boards, in Bangla, English or a mix of both. Students miss deadlines because the required action is buried inside a long notice. Build a system that reads notices in either language, extracts the information a student must act on, and answers questions about them.",
    features: [
      "Accept scanned PDFs, photos of printed notices, digital PDFs and plain text.",
      "Image preprocessing (deskew, noise removal, cropping) and OCR for Bangla, English and mixed-language notices.",
      "Extract structured fields: title, issuing office, date of issue, deadlines, event date and time, venue, target students (department, batch, semester), required action, fees and contact.",
      "Convert Bangla dates and digits (for example ১৫ অক্টোবর ২০২৬) into standard dates.",
      "Short summary of each notice in both Bangla and English.",
      "Classify notices as exam, registration, fee, holiday, event, scholarship, result or general.",
      "Searchable notice archive with filters by category, department and date.",
      "Question answering over stored notices, citing the source notice and the matching passage.",
      "Personalised feed: students choose their department and batch, see only relevant notices, get deadline reminders and can export deadlines to a calendar (.ics).",
      "Evaluation on at least 30 notices: report OCR character error rate and extraction accuracy for each field.",
    ],
    roles: [
      ["Student", "Reads the personalised feed, searches and asks questions."],
      ["Office Staff / Publisher", "Uploads notices, corrects extracted fields, publishes."],
      ["Administrator", "Manages users, departments and categories."],
    ],
    restrictions: [
      "Use public university notices or synthetic notices.",
      "Extracted fields must be reviewed by staff before publication, and answers must come only from stored notices.",
    ],
    optional:
      "Handwritten notice support, text-to-speech reading, Messenger or Telegram bot, duplicate notice detection, highlighting changes between a notice and its revised version.",
  },
  {
    id: "B2", track: "B", name: "PUB AssessAI",
    subtitle: "AI Question Preparation, Assessment and Learning Portal",
    description:
      "Teachers spend many hours writing questions, assembling papers and marking written answers, while students receive little feedback between examinations. Build an AI-assisted portal in which teachers generate and curate questions from their own course materials, run practice and formal assessments, and evaluate written answers with teacher-approved criteria, while students receive explanations grounded in the course materials and targeted practice.",
    features: [
      "Course setup: upload materials (slides, notes, PDFs) and organise them by topic and course learning outcome (CLO).",
      "Generate MCQ, short and broad questions from the materials, each with difficulty, Bloom's level, CLO mapping, a suggested answer and a source reference.",
      "Teachers edit, approve or reject generated questions and maintain a searchable question bank.",
      "Assemble a question paper and answer key with configurable sections, marks and choices; show topic and CLO coverage; export to PDF or Word.",
      "Practice sessions and timed formal assessments with MCQ and typed written answers, autosaved drafts and recorded submission time.",
      "Automatic marking of MCQ, and AI evaluation of written answers against a teacher-approved marking scheme, giving marks per criterion with a short justification.",
      "Teachers review, adjust and approve marks before they are published.",
      "After an attempt, students receive explanations based on the course materials and follow-up practice on the topics they got wrong.",
      "Progress tracking of attempts, scores and topic-wise performance for each student and for the class.",
      "Assessment integrity for formal tests: question and option shuffling, time limits, tab-switch logging, and no AI tutor access during the test.",
    ],
    roles: [
      ["Teacher", "Uploads materials, curates questions, builds papers, moderates marks."],
      ["Student", "Practises, takes assessments, reviews feedback and progress."],
      ["Administrator", "Manages courses, users and enrolments."],
    ],
    restrictions: [
      "AI-generated marks are never published without teacher approval.",
      "Every generated question and explanation must refer to the course material it came from.",
    ],
    optional:
      "Bangla support, adaptive difficulty, spaced revision, alternative paper sets, similarity check on written answers, class analytics.",
  },
  {
    id: "B3", track: "B", name: "PUB SkillSync",
    subtitle: "AI-Powered Skill Matching, Productivity and Academic Early-Warning Platform",
    description:
      "Students struggle to find teammates with the right skills for projects and competitions, teams lose track of who is doing what, and teachers often notice a struggling student only after the final examination. Build a platform that forms teams by matching skills, helps students plan and track their work, and uses machine learning to flag students at academic risk early, with reasons an advisor can act on.",
    features: [
      { module: "Skill profile and team matching" },
      "Profile with skills and self-rated level, frameworks, interests, past projects, GitHub link and weekly availability, with visibility control for each field.",
      "Project or competition posts with required skills and team size; search for members with filters.",
      "Matching algorithm that ranks candidates by skill complementarity, shared interest and availability, and shows how the score was calculated.",
      "Join requests, invitations and team management.",
      { module: "Planning and progress" },
      "Team task board with owners, priorities, deadlines and dependencies; warnings for overdue work and overloaded members.",
      "Personal weekly planner with focus-session timer, comparing planned and actual effort.",
      "AI suggestions for breaking a task into steps and revising a plan; the user accepts or edits them.",
      { module: "Academic early warning" },
      "Import academic data (attendance, quizzes, assignments, mid-term marks, previous GPA) from CSV.",
      "Train and compare at least two models, predict Low, Medium or High risk, report accuracy, precision, recall and F1-score, and justify the final choice.",
      "Explain each prediction with its main contributing factors (e.g. SHAP) and suggest interventions on an advisor dashboard.",
    ],
    roles: [
      ["Student", "Maintains profile, joins teams, plans tasks, sees own risk report."],
      ["Team Leader", "Posts projects, accepts members, manages the task board."],
      ["Teacher / Advisor", "Views risk reports for advisees and records interventions."],
      ["Administrator", "Manages users and imports academic data."],
    ],
    restrictions: [
      "Use synthetic or anonymised academic data. A risk report is visible only to the student and the student's advisor.",
      "No automatic action may be taken against a student based on a prediction alone.",
    ],
    optional:
      "GitHub activity integration, team compatibility score, reflection journal, AI-generated progress feedback, peer evaluation within teams.",
  },
  {
    id: "B4", track: "B", name: "PUB AttendEye",
    subtitle: "Computer-Vision-Based Smart Attendance System",
    description:
      "Calling the roll wastes class time and paper sign-in sheets allow proxy attendance. Build a system that takes attendance from a live camera feed or a photo of the class, recognises enrolled students, lets the teacher confirm uncertain cases, and keeps reliable attendance records for every course.",
    features: [
      "Student enrolment with consent, capturing several face samples per student and linking them to student ID, course and section.",
      "The teacher starts a class session (course, section, time window) and captures attendance from a live camera feed or an uploaded classroom photo.",
      "Detect and recognise multiple faces in a single frame and mark matched students present.",
      "Confidence threshold: unknown or low-confidence faces are sent to the teacher for review instead of being marked automatically.",
      "Liveness or anti-spoofing check against a printed photo or a face shown on a phone screen.",
      "Manual correction by the teacher; every correction is logged with time and reason.",
      "Students see their attendance percentage for each course and receive an alert when it falls below a configurable limit.",
      "Course-wise and date-wise reports with CSV or PDF export.",
      "Evaluation on a small test set under different lighting and angles: report precision and recall (or false-accept and false-reject rates) and justify the chosen threshold.",
    ],
    roles: [
      ["Student", "Enrols face samples with consent and views own attendance."],
      ["Teacher", "Runs sessions, reviews flagged faces, corrects records, exports reports."],
      ["Administrator", "Manages courses, sections, users and the attendance limit."],
    ],
    restrictions: [
      "Use only faces of consenting volunteers (for example, team members). Do not use scraped images of real students.",
      "Store face embeddings rather than raw photos where possible, and protect all biometric data.",
      "Pretrained detection and recognition models may be used, but the team must explain the complete pipeline.",
    ],
    optional:
      "Handling masks and partial occlusion, QR plus face two-factor check-in, CCTV or IP-camera stream, offline mobile mode, attendance analytics dashboard.",
  },
  {
    id: "C1", track: "C", name: "PUB CampusMate",
    subtitle: "Smart Campus Companion with Academic Planning, Course Registration and AI Helpdesk",
    description:
      "Class routines, exam schedules, notices and academic rules are spread across notice boards, social media groups and office visits. Course registration and routine preparation are done by hand, so clashes are found late. Build one platform where students follow their academic life, the department plans the semester and registers students without conflicts, and an AI helpdesk answers academic questions from official documents.",
    features: [
      { module: "Student companion" },
      "Secure login and a personal dashboard with class schedule, exam schedule, personal timetable and room locations.",
      "Notices, event notifications and a faculty directory.",
      { module: "Academic planning and registration" },
      "Manage curricula, prerequisites, semester offerings, sections, rooms and teacher availability.",
      "Course registration with prerequisite, credit-limit, seat-capacity and timetable-clash checks; advisor approval and add/drop requests.",
      "Assign teachers to courses and calculate normal and extra teaching load using configurable rules.",
      "Create and revise the routine; detect teacher, room, section and registered-student clashes before publishing; arrange make-up classes.",
      "Publish approved schedules, notify affected users and keep the revision history.",
      { module: "AI helpdesk" },
      "Chat assistant that answers questions about courses, prerequisites, faculty, labs, notices and the academic calendar using retrieval over official department documents.",
      "Every answer cites its source, Bangla and English questions are supported, and the assistant says so when the documents do not contain the answer.",
    ],
    roles: [
      ["Student", "Views schedules and notices, registers for courses, uses the helpdesk."],
      ["Teacher", "Sets availability, views assigned courses and load, proposes make-up classes."],
      ["Academic Advisor", "Approves registrations and add/drop requests."],
      ["Department Coordinator", "Manages offerings, routine, notices and helpdesk documents."],
    ],
    restrictions: [
      "Any platform may be used: web, mobile or both. Authentication and role-based access must be enforced on the server.",
      "Demonstrate one department and one semester with sample student academic histories.",
    ],
    optional:
      "Campus map, push notifications, automatic timetable generation, clash-repair suggestions, waiting lists, calendar export.",
  },
  {
    id: "C2", track: "C", name: "PUB SafeCampus",
    subtitle: "Emergency Response and Campus Safety Application",
    description:
      "When a student faces harassment, an accident, a medical problem or a fire on campus, the quickest help is usually nearby security staff or the proctor's office, but students often do not know whom to contact and nothing is recorded. Build an application that lets anyone on campus raise an alert or report an incident in seconds, routes it to the right responders with location, and tracks it until it is resolved.",
    features: [
      "SOS button (hold to confirm, with a short cancel countdown) that sends identity, live location and time to the security desk and to the user's personal emergency contacts.",
      "Incident reports by category (medical, harassment, ragging, fire, accident, theft, hazard) with description, photo or video, and location as a map pin or building and room.",
      "Anonymous reporting for sensitive categories such as harassment and ragging.",
      "Responder dashboard showing active alerts on a map, ordered by severity, with assignment to a responder and acknowledgement.",
      "Status tracking (Reported, Acknowledged, Responder on the way, Resolved) with timestamps visible to the reporter, and chat between reporter and responder.",
      "Campus emergency directory (security, medical centre, proctor, fire service, ambulance) with one-tap calling.",
      "Broadcast alerts from the security office to all users (for example fire drill or flood warning) with read confirmation.",
      "Offline fallback: queue the report and send it when the connection returns, or prepare an SMS.",
      "Incident history and reports: response time, incidents by category and location, and an incident heat map.",
    ],
    roles: [
      ["Student / Staff", "Raises SOS alerts, reports incidents, follows status."],
      ["Responder", "Security staff, medical officer or proctor; accepts and resolves incidents."],
      ["Security Administrator", "Manages responders, broadcasts alerts, views reports."],
    ],
    restrictions: [
      "Label the application as a prototype and provide a clearly marked test mode.",
      "Never contact real emergency services (such as 999) during testing.",
      "Location is shared only with permission and only while an alert is active. Anonymous reports must not reveal the reporter.",
    ],
    optional:
      "Nearest-responder selection, fake-call feature, SMS simulation, walk-with-me live location sharing, shake-to-alert.",
  },
  {
    id: "C3", track: "C", name: "SmartRent BD",
    subtitle: "Student Housing and Roommate Matching Platform",
    description:
      "Students who move away from home for university struggle to find safe and affordable rooms, hostel seats or mess seats near campus. They depend on Facebook groups, brokers and word of mouth, and fake listings that ask for advance payment are common. Build a platform that lists verified accommodation near the university, matches compatible roommates, and helps roommates manage shared expenses.",
    features: [
      "Owner listings for rooms, flats, mess seats and hostel seats with rent, deposit, utilities, facilities (Wi-Fi, generator, water, meals), gender policy, photos, map location and availability date.",
      "Search and filter by distance from campus, budget, type, facilities and gender policy, with a map view.",
      "Listing verification: the administrator checks owner identity and marks inspected listings as Verified.",
      "Roommate profile covering budget, preferred area, sleep schedule, study habits, cleanliness, smoking, food and guests.",
      "Compatibility matching with a score and explanation; contact details are shared only after both sides agree.",
      "Visit and booking requests: the student requests a visit, the owner schedules it, and booking is confirmed.",
      "Ratings and reviews of listings and owners by verified tenants only.",
      "Report fake listings or advance-payment scams; reported listings are hidden until reviewed.",
      "Shared expense manager for roommates: rent split, utility bills, mess meal accounts, balances and a monthly summary.",
      "Maintenance requests from tenant to owner with status, and alerts for new listings that match saved searches.",
    ],
    roles: [
      ["Student / Tenant", "Searches, finds roommates, books, reviews, shares expenses."],
      ["Owner / Landlord", "Posts listings, schedules visits, handles maintenance requests."],
      ["Administrator / Moderator", "Verifies owners and listings, handles reports."],
    ],
    restrictions: [
      "No real payments; use simulated records. Personal profiles must have visibility controls.",
    ],
    optional:
      "Waiting list for popular listings, rent agreement generation, in-app chat, fair-rent estimation, mess manager rotation.",
  },
  {
    id: "C4", track: "C", name: "PUB CampusRide",
    subtitle: "Campus Transport Scheduling and Operations Portal",
    description:
      "University buses run on fixed routes, but schedules are shared on paper or by phone, students do not know when a trip is delayed or cancelled, and the transport office cannot see whether a bus is overloaded. Build a portal that manages routes, buses, drivers and trips, keeps students informed, and gives the transport office reliable data on delays, demand and vehicle usage.",
    features: [
      "Manage routes with ordered stops, service days, travel times and pickup instructions.",
      "Maintain bus capacity, vehicle status (available, under maintenance, temporarily unavailable) and driver availability.",
      "Schedule recurring and one-off trips, and detect overlapping vehicle or driver assignments.",
      "Students view schedules, save preferred routes and record travel intentions; compare expected demand with bus capacity.",
      "Driver or dispatcher interface to record departure, stop arrivals, delays, completion and cancellation.",
      "Handle breakdowns and driver absence by finding an available replacement and flagging capacity shortages.",
      "Publish trip updates and notify affected passengers about delays, cancellations or changed arrangements.",
      "Record maintenance needs, incidents and passenger feedback, and track follow-up actions to resolution.",
      "Trip history and reports covering delays, cancellations, passenger demand and vehicle usage.",
    ],
    roles: [
      ["Student / Passenger", "Views schedules, saves routes, records travel intention, gives feedback."],
      ["Driver", "Records trip progress, delays and incidents."],
      ["Transport Coordinator", "Manages routes, buses, drivers and trips; handles disruptions."],
    ],
    restrictions: [
      "Demonstrate one campus with a small set of routes, buses and drivers. Manually reported trip status is enough for the core workflow.",
    ],
    optional:
      "Live GPS tracking, arrival-time estimation, seat reservation, boarding check-in, route optimisation.",
  },
  {
    id: "C5", track: "C", name: "PUB FestHub",
    subtitle: "Campus Event, Competition and Coding Contest Operations Platform",
    description:
      "Department fests run seminars, competitions and programming contests with dozens of volunteers, and most of the coordination happens in chat groups and spreadsheets. Build a platform that organises an event from planning to results: registration, scheduling, volunteers, judging, and a built-in programming contest with automatic judging.",
    features: [
      { module: "Events and competitions" },
      "Create an event with activities (seminar, workshop, competition), eligibility, registration deadline, participant limit and venue.",
      "Individual and team registration with invitations, approval, cancellation and waiting list.",
      "Schedule activities and rounds; flag venue clashes and overlapping volunteer duties.",
      "Judging for general competitions: versioned entries, judge assignment, rubric scores and organiser-approved results.",
      { module: "Volunteers and operations" },
      "Volunteer availability, duty and shift assignment, and coordinator-approved replacement requests.",
      "QR check-in for participants, volunteer attendance and task completion records.",
      "Announcements, issue tracking with owner and resolution, and a readiness view (uncovered shifts, missing judges).",
      { module: "Programming contest" },
      "Problem bank with statements, constraints, samples and hidden test cases; contests with start and end time and ICPC-style scoring.",
      "Submissions in at least one language judged in an isolated sandbox with time and memory limits, verdicts (AC, WA, TLE, RE, CE) and a live scoreboard with freeze.",
      "Practice mode after the contest, editorials released after the end, and topic-wise progress for each student.",
    ],
    roles: [
      ["Organiser / Coordinator", "Creates events, schedules, approves results, manages volunteers."],
      ["Participant / Team Leader", "Registers, submits entries or code, views results."],
      ["Volunteer", "Takes shifts, checks in participants, reports issues."],
      ["Judge / Problem Setter", "Scores entries; sets contest problems and test data."],
    ],
    restrictions: [
      "Submitted code must never run directly on the server; use a container or an existing judge engine (e.g. Judge0). The contest logic must be built by the team.",
    ],
    optional:
      "Certificates, sponsor tracking, equipment allocation, plagiarism check for code, AI feedback on submissions.",
  },
  {
    id: "D1", track: "D", name: "PUB ThesisHub",
    subtitle: "Project and Thesis Supervision and Collaboration Portal",
    description:
      "Final-year projects and theses are managed through email, chat groups and printed forms. Coordinators cannot see which projects are behind schedule, feedback gets lost, and earlier versions of a report are overwritten. Build a portal that manages projects, theses and research work from proposal to final evaluation.",
    features: [
      "Proposal submission with title, abstract, research area, team members and supervisor preference.",
      "The coordinator assigns supervisors while respecting a maximum load per supervisor.",
      "Supervisors approve, reject or request revision of a proposal; the approved scope is saved as a version.",
      "Milestones (literature review, design, implementation, draft report, final report) with deadlines and member responsibilities; overdue work is flagged.",
      "Progress reports with evidence, blockers and next steps, and versioned deliverables with the full submission history.",
      "Supervisor feedback, comments and revision requests on each submission, with approval status.",
      "Private project chat for team members and supervisor, with saved messages and unread indicators.",
      "Meeting log recording date, attendees, decisions and follow-up actions with owner and deadline.",
      "Coordinator dashboard with status of all projects, supervisor loads and projects at risk.",
      "Final submission checklist (report, code, poster, similarity report), defence scheduling and rubric-based evaluation by the board.",
    ],
    roles: [
      ["Student / Researcher", "Submits proposals, reports and deliverables; chats with supervisor."],
      ["Supervisor", "Reviews work, gives feedback, approves milestones."],
      ["Coordinator", "Assigns supervisors, monitors progress, schedules defences."],
      ["Board Member / Examiner", "Evaluates the defence with the rubric."],
    ],
    restrictions: [
      "Students can see only their own project. Earlier submissions are never overwritten.",
    ],
    optional:
      "Similarity checking, AI progress summaries, deadline reminders, report format checking, searchable archive of past theses.",
  },
  {
    id: "D2", track: "D", name: "PUB GradPath",
    subtitle: "Higher-Study Discovery and Application Workspace",
    description:
      "Students who plan higher study abroad collect information about programmes, professors, scholarships and deadlines from many websites and keep it in scattered notes. Requirements are missed, recommendation letters are requested late, and costs are underestimated. Build a workspace that helps a student find suitable opportunities, prepare applications, plan funding and track every outcome.",
    features: [
      "Student profile with academic background, research interests, skills, publications, experience and supporting documents.",
      "Searchable records of programmes, universities, professors, labs and funding, each with its source and the date it was last checked.",
      "Profile-to-opportunity matching that explains the fit and lists requirement gaps.",
      "Compare shortlisted opportunities by research fit, requirements, funding, estimated cost and deadline; keep notes and mentor feedback.",
      "Eligibility check against recorded requirements; track required tests (IELTS, GRE), scores and planned test dates.",
      "Application-specific checklists and tasks with deadlines, dependencies and reminders.",
      "Document manager for SOP, CV and research statements with versions, mentor comments and review status.",
      "Track recommendation requests, professor outreach emails, pending replies and follow-ups.",
      "Scholarship and funding tracker, and a cost estimate (fees, living cost, travel) using entered amounts, currencies and stated assumptions.",
      "Application readiness view, plus records of submissions, interviews, decisions and offer-response deadlines.",
    ],
    roles: [
      ["Student / Applicant", "Builds profile, shortlists, prepares and tracks applications."],
      ["Mentor", "Reviews documents, gives feedback on choices and readiness."],
      ["Administrator", "Maintains opportunity records and user accounts."],
    ],
    restrictions: [
      "Opportunity data may be entered manually or imported from a sample dataset; do not scrape websites against their terms of use.",
    ],
    optional:
      "AI-assisted matching, SOP feedback, interview practice, automatic deadline updates, calendar integration.",
  },
  {
    id: "D3", track: "D", name: "PUB RoboRoute",
    subtitle: "Campus Delivery Robot: A Programming and Logic Game",
    description:
      "New programmers often find loops, conditions and functions abstract. Build an educational game in which students program a simulated robot to collect and deliver parcels on a campus map, learning sequencing, loops, conditions and functions by watching their program run step by step.",
    features: [
      "A campus grid with paths, buildings, pickup points, delivery destinations and obstacles.",
      "Build and edit programs with command blocks or a simple text language, supporting move, turn, pick up, deliver, loops, conditions (e.g. path ahead clear, parcel here) and reusable functions.",
      "At least five missions of increasing difficulty with clear objectives and completion rules, where later missions require loops, conditions and functions.",
      "Run, pause, step and restart, highlighting the current instruction and showing robot position, direction and parcel status.",
      "Clear messages for blocked movement, invalid actions and incomplete deliveries, with contextual hints and the option to revise and retry.",
      "Score each attempt on delivery success, number of steps and program length, and award stars.",
      "Save programs, attempt history and mission progress for each player.",
      "Mission editor for instructors to design maps, place parcels and obstacles, and set objectives.",
      "Instructor view of class progress: missions completed, attempts and common errors.",
    ],
    roles: [
      ["Student / Player", "Writes and runs programs, completes missions, sees progress."],
      ["Instructor", "Creates and edits missions, reviews class progress."],
    ],
    restrictions: [
      "A 2D simulation with a limited command set is sufficient; physical robot hardware is optional.",
    ],
    optional:
      "Battery or time limits, multiple parcels at once, sharing challenges with friends, AI debugging hints, leaderboard.",
  },
];

// Animated short film track
const FILMS = [
  {
    id: "E1", title: "A Day in the Life of a CSE Student",
    concept:
      "Follow one student from the first day in the CSE department through classes, labs, assignments, friendship, failure and growth. The film should feel honest and familiar to any CSE student, showing both the pressure and the reward of studying computer science.",
    elements: [
      "First day and orientation in the department.",
      "First programming class and the first program that does not compile.",
      "A lab session and a late-night assignment with debugging.",
      "Friendship and teamwork on a project or competition.",
      "A clear setback (a failed exam, a rejected project, a lost contest) followed by growth.",
      "A reflective ending, for example graduation or a senior advising a new student.",
    ],
    specific: [
      "The main character must change by the end of the film; show the change through actions, not only narration.",
      "Use at least three recognisable campus locations (classroom, lab, corridor, canteen or similar).",
    ],
    use: "Orientation programmes, CSE Fest, department anniversaries and admission activities.",
  },
  {
    id: "E2", title: "From Student to Software Engineer",
    concept:
      "A career story that follows a student from choosing CSE, through struggling with programming and discovering different fields, to completing projects and entering professional life. The film should inspire new students and show that the path is built step by step.",
    elements: [
      "Why the student chose CSE.",
      "Early struggles with programming.",
      "Discovering fields such as AI/ML, software engineering, cybersecurity and networking.",
      "A team project that becomes a turning point.",
      "Internship or career preparation (CV, interview, first job offer).",
      "Graduation and future goals.",
    ],
    specific: [
      "Show at least two fields of computing visually, for example with animated screens, diagrams or metaphors.",
      "The film should carry one clear message for a first-year student, stated or shown by the end.",
    ],
    use: "An inspirational film and a promotional video for the department.",
  },
  {
    id: "E3", title: "The Code That Changed Our Department",
    concept:
      "A fictional mystery set inside the CSE department. Late one night, students discover an old computer holding an unfinished project left by earlier students. Following clues in the code, they uncover its purpose and complete it, connecting past, present and future generations of the department.",
    elements: [
      "A late-night scene in a CSE lab.",
      "Discovery of an old computer or an unfinished project.",
      "A mystery around the code: what it does and who wrote it.",
      "Investigation and teamwork, with clues found in comments, commits or old files.",
      "References to the department's real labs, clubs, research or achievements.",
      "Completion of the project and an emotional link between past and present students.",
    ],
    specific: [
      "Plant at least two clues early in the film that pay off at the end.",
      "Code shown on screen should look realistic; avoid random symbols.",
    ],
    use: "Introducing the department to visitors and new students without feeling like a brochure.",
  },
];

module.exports = { TRACKS, PROBLEMS, FILMS };
