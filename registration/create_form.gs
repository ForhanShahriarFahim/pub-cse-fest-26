/**
 * Builds the PUB CSE Fest 2026 Programming Contest team registration form
 * and links it to a new Google Sheet for responses.
 *
 * How to run:
 *   1. Open https://script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, and save.
 *   3. Choose createRegistrationForm in the toolbar and click Run.
 *      Allow the permissions it asks for (Forms and Sheets in your Drive).
 *   4. Open View → Logs (or Execution log) to get the form, edit and sheet links.
 */

const DEADLINE = '13 October 2026 (Tuesday), 11:59 PM';
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

// Same batch numbers as the PUB CSE Fest 2026 registration form.
const HSC_BATCHES = [22, 23, 24, 25, 26, 27, 28, 29];
const DIPLOMA_BATCHES = [16, 17, 18, 19, 20, 21, 22, 23];

// One dropdown per member covers both streams, so the sheet gets one clean
// column per member and nobody can pick a batch from the wrong stream.
const PROGRAM_BATCH_CHOICES = []
  .concat(HSC_BATCHES.map(b => 'B.Sc. in CSE (HSC), Batch ' + b))
  .concat(DIPLOMA_BATCHES.map(b => 'B.Sc. in CSE (Diploma), Batch ' + b));

function createRegistrationForm() {
  const form = FormApp.create('PUB CSE Fest 2026: Programming Contest Registration');

  form.setDescription(
    'The Department of Computer Science & Engineering, ' +
    'Pundra University of Science & Technology, welcomes you to the Programming Contest ' +
    'of PUB CSE FEST 2026 (28–31 October 2026).\n\n' +
    'Only the TEAM LEADER fills in this form, with the details of all three members. ' +
    'Other members do not need to submit anything.\n\n' +
    'Rules:\n' +
    '• Each team has exactly 3 members.\n' +
    '• Each team must include at least one 1st-year student (1st or 2nd semester).\n' +
    '• Only CSE students registered for PUB CSE FEST 2026 can take part.\n' +
    '• A student can be a member of only one team.\n' +
    '• Team members cannot be changed after registration.\n' +
    '• Organizers may rename any inappropriate team name.\n' +
    '• The contest follows ICPC guidelines.\n\n' +
    'Deadline: ' + DEADLINE + '\n' +
    'Contact: M.Z.I. Jewel, Radha Rani Paul\n' +
    'Updates: https://www.facebook.com/pubcsefest\n\n' +
    'PUB CSE FEST 2026 · CSE @ 12: Celebrating 12 Years of CSE'
  );
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(true);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    'Your team is registered for the PUB CSE FEST 2026 Programming Contest. ' +
    'You can edit your response from the link in your confirmation until the deadline (' +
    DEADLINE + '). Contest login details will be handed over on contest day.'
  );

  // Section 1: Team
  form.addTextItem()
    .setTitle('Team Name')
    .setHelpText('At most 30 characters. Organizers may rename inappropriate names.')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Team name must be at most 30 characters.')
      .requireTextLengthLessThanOrEqualTo(30)
      .build());

  // Sections 2-4: one per member
  addMemberSection(form, 'Team Leader', 'Your own details. Your email is collected automatically.');
  addMemberSection(form, 'Member 2', 'Details of the second member.');
  addMemberSection(form, 'Member 3', 'Details of the third member.');

  // Section 5: Confirmation
  form.addPageBreakItem().setTitle('Confirmation');

  form.addCheckboxItem()
    .setTitle('Which member(s) are from 1st or 2nd semester?')
    .setHelpText('Every team needs at least one 1st-year member.')
    .setChoiceValues(['Team Leader', 'Member 2', 'Member 3'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Declaration')
    .setChoiceValues([
      'All three members are CSE students registered for PUB CSE FEST 2026, have agreed ' +
      'to join this team, and are not part of any other team. The information above is ' +
      'correct, and the team cannot be changed after submission.'
    ])
    .setRequired(true);

  // Responses go to a new Google Sheet.
  const sheet = SpreadsheetApp.create('PUB CSE Fest 2026 Contest Registrations (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Newer Google Forms start unpublished; publish it where the API supports that.
  if (typeof form.setPublished === 'function') {
    form.setPublished(true);
  }

  Logger.log('Share this link:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:    ' + form.getEditUrl());
  Logger.log('Responses sheet:  ' + sheet.getUrl());
}

function addMemberSection(form, label, helpText) {
  form.addPageBreakItem().setTitle(label).setHelpText(helpText);

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

  form.addTextItem()
    .setTitle(label + ': Contact Number')
    .setHelpText('11 digits, e.g. 017XXXXXXXX')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Enter an 11-digit Bangladeshi mobile number, e.g. 017XXXXXXXX.')
      .requireTextMatchesPattern('^01[3-9][0-9]{8}$')
      .build());
}
