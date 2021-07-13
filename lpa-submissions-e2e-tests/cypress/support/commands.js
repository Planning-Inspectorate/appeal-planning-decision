require('cypress-file-upload');
require('./visit-without-javascript-enabled');
require('./accessibility');

Cypress.Commands.add('goToPage', require('./common/goToPage'));

Cypress.Commands.add('verifyPage', require('./common/verifyPage'));

Cypress.Commands.add('verifyPageHeading', require('./common/verifyPageHeading'));

Cypress.Commands.add('verifyPageTitle', require('./common/verifyPageTitle'));

Cypress.Commands.add('verifySectionName', require('./common/verifySectionName'));

Cypress.Commands.add('visibleWithText', require('./common/visibleWithText'));

Cypress.Commands.add('visibleWithoutText', require('./common/visibleWithoutText'));

Cypress.Commands.add('getAppealReplyId', require('./common/getAppealReplyId'));

Cypress.Commands.add(
  'goToTaskListPage',
  require('./appeals-questionnaire-tasklist/goToTaskListPage'),
);

Cypress.Commands.add('clickOnSubTaskLink', require('./common/clickOnSubTaskLink'));

Cypress.Commands.add(
  'verifyCompletedStatus',
  require('./appeals-questionnaire-tasklist/verifyCompletedStatus'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('./check-your-answers/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayed',
  require('./check-your-answers/confirmCheckYourAnswersDisplayed'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayedTextIsBlank',
  require('./check-your-answers/confirmCheckYourAnswersDisplayedTextIsBlank'),
);

Cypress.Commands.add('verifyAppealDetailsSidebar', require('./common/verifyAppealDetailsSidebar'));

Cypress.Commands.add('getAppealDetailsSidebar', require('./common/getAppealDetailsSidebar'));

Cypress.Commands.add('clickSaveAndContinue', require('./common/clickSaveAndContinue'));

Cypress.Commands.add('clickSubmitButton', require('./common/clickSubmitButton'));

Cypress.Commands.add('clickBackButton', require('./common/clickBackButton'));

Cypress.Commands.add('validateErrorMessage', require('./common/validateErrorMessage'));
Cypress.Commands.add(
  'validateFileUploadErrorMessage',
  require('./common/validateFileUploadErrorMessage'),
);

Cypress.Commands.add('generateQuestionnaire', require('./common/generateQuestionnaire'));

Cypress.Commands.add('completeQuestionnaire', require('./common/completeQuestionnaire'));

Cypress.Commands.add('hasLink', require('./common/hasLink'));

Cypress.Commands.add(
  'downloadSubmissionPdf',
  require('./common/pdfFunctions').downloadSubmissionPdf,
);

Cypress.Commands.add(
  'checkSubmissionPdfContent',
  require('./common/pdfFunctions').checkSubmissionPdfContent,
);

Cypress.Commands.add('completeAppeal', require('./common/completeAppeal'));
