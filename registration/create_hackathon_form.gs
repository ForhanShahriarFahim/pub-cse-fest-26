/**
 * Builds the PUB CSE Fest 2026 Hackathon team registration form
 * and links it to a new Google Sheet for responses.
 *
 * How to run:
 *   1. Open https://script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, and save.
 *   3. Choose createHackathonForm in the toolbar and click Run.
 *      Allow the permissions it asks for (Forms and Sheets in your Drive).
 *   4. Open View → Logs (or Execution log) to get the form, edit and sheet links.
 *
 * Header image and theme colour are set by hand afterwards (Apps Script cannot
 * set them): Customize theme → Header → upload form-header.png, colour #0B1760.
 */

const DEADLINE = '13 October 2026 (Tuesday), 11:59 PM';
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

// Same batch numbers as the PUB CSE Fest 2026 registration form.
const HSC_BATCHES = [22, 23, 24, 25, 26, 27, 28, 29];
const DIPLOMA_BATCHES = [16, 17, 18, 19, 20, 21, 22, 23];

// 1st-year batches in the Summer 26 session.
const HSC_FIRST_YEAR = [28, 29];
const DIPLOMA_FIRST_YEAR = [22, 23];

// One dropdown per member covers both streams, so the sheet gets one clean
// column per member and nobody can pick a batch from the wrong stream.
// 1st-year options are tagged so the team rule can be checked from the sheet.
const PROGRAM_BATCH_CHOICES = []
  .concat(HSC_BATCHES.map(b => 'B.Sc. in CSE (HSC), Batch ' + b +
    (HSC_FIRST_YEAR.includes(b) ? ' (1st year)' : '')))
  .concat(DIPLOMA_BATCHES.map(b => 'B.Sc. in CSE (Diploma), Batch ' + b +
    (DIPLOMA_FIRST_YEAR.includes(b) ? ' (1st year)' : '')));

function createHackathonForm() {
  const form = FormApp.create('PUB CSE Fest 2026 — Hackathon Team Registration');

  form.setDescription(
    'The Department of Computer Science & Engineering, ' +
    'Pundra University of Science & Technology (PUB), welcomes you to the Hackathon ' +
    'of PUB CSE FEST 2026 (28–31 October 2026).\n\n' +
    '📝 Only the TEAM LEADER fills in this form, with the details of all five members. ' +
    'Other members do not need to submit anything.\n\n' +
    'Team Rules\n' +
    '• Open only to current students of the PUB CSE department.\n' +
    '• Exactly 5 members per team.\n' +
    '• At least one 1st-year member (1st or 2nd semester): ' +
    'HSC Batch 28, 29 or Diploma Batch 22, 23.\n' +
    '• A student can be in only one team.\n\n' +
    'Project Requirements\n' +
    '• Each team must upload its project to GitHub.\n' +
    '• For the final evaluation, each team must present a live demo of its project ' +
    'on its own laptop.\n\n' +
    'Topic Selection: 14 October 2026 (offline)\n' +
    '• Each team gives its top 5 topic choices in order of priority.\n' +
    '• Each topic can be taken by at most 2 teams.\n' +
    '• Teams pick in the order they arrive. If two teams arrive at the same time, ' +
    'the team that registered first picks first.\n' +
    '• A team gets its highest-priority choice that is still available. If that topic ' +
    'already has 2 teams, its next choice is checked, and so on.\n' +
    '• For topic selection, contact M. Z. I. Juwel or Radha Rani Paul.\n\n' +
    'Prizes\n' +
    '1st, 2nd and 3rd place. Prize pool to be announced soon.\n\n' +
    'Deadline: ' + DEADLINE + '\n' +
    'Updates: https://www.facebook.com/pubcsefest\n\n' +
    'PUB CSE FEST 2026 · CSE @ 12: Celebrating 12 Years of CSE'
  );
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(true);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    'Your team is registered for the PUB CSE FEST 2026 Hackathon. ' +
    'You can edit your response from the link in your confirmation until the deadline (' +
    DEADLINE + '). Topic selection takes place offline on 14 October 2026.'
  );

  // Section 1: Team & Team Leader (the form's first page, before any page break)
  form.addSectionHeaderItem()
    .setTitle('Team & Team Leader')
    .setHelpText('Your email is collected automatically.');

  form.addTextItem()
    .setTitle('Team Name')
    .setHelpText('At most 30 characters.')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Team name must be at most 30 characters.')
      .requireTextLengthLessThanOrEqualTo(30)
      .build());

  addMemberQuestions(form, 'Team Leader');

  form.addTextItem()
    .setTitle('Team Leader: Phone Number')
    .setHelpText('11 digits, e.g. 017XXXXXXXX')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Enter an 11-digit Bangladeshi mobile number, e.g. 017XXXXXXXX.')
      .requireTextMatchesPattern('^01[3-9][0-9]{8}$')
      .build());

  // Sections 2-5: one per member
  ['Member 2', 'Member 3', 'Member 4', 'Member 5'].forEach(label => {
    form.addPageBreakItem().setTitle(label);
    addMemberQuestions(form, label);
  });

  // Section 6: Declaration
  form.addPageBreakItem().setTitle('Declaration');

  form.addCheckboxItem()
    .setTitle('Declaration')
    .setChoiceValues([
      'We confirm that all 5 members are current students of the PUB CSE department, ' +
      'at least one member is in the 1st or 2nd semester, the information given in this ' +
      'form is correct, and we agree to follow the hackathon rules announced by the organizers.'
    ])
    .setRequired(true);

  // Responses go to a new Google Sheet.
  const sheet = SpreadsheetApp.create('PUB CSE Fest 2026 Hackathon Registrations (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Newer Google Forms start unpublished; publish it where the API supports that.
  if (typeof form.setPublished === 'function') {
    form.setPublished(true);
  }

  Logger.log('Share this link:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:    ' + form.getEditUrl());
  Logger.log('Responses sheet:  ' + sheet.getUrl());
}

function addMemberQuestions(form, label) {
  form.addTextItem()
    .setTitle(label + ': Full Name')
    .setHelpText('As it should appear on the certificate.')
    .setRequired(true);

  form.addTextItem()
    .setTitle(label + ': Student ID (Roll)')
    .setRequired(true);

  form.addListItem()
    .setTitle(label + ': Program & Batch')
    .setHelpText('Choose your stream (HSC or Diploma) and batch.')
    .setChoiceValues(PROGRAM_BATCH_CHOICES)
    .setRequired(true);

  form.addListItem()
    .setTitle(label + ': Semester (Summer 26)')
    .setChoiceValues(SEMESTERS)
    .setRequired(true);
}
