import '@testing-library/cypress/add-commands';
require('../support/common/accessibility');
require('cypress-file-upload');
require('../support/householder-planning/lpa-questionnaire/visit-without-javascript-enabled');


Cypress.Commands.add('goToPage', require('../support/common/goToPage'));


Cypress.Commands.add('visibleWithText', require('../support/common/visibleWithText'));

Cypress.Commands.add('visibleWithoutText', require('../support/common/visibleWithoutText'));

Cypress.Commands.add('getAppealReplyId', require('../support/common/getAppealReplyId'));

Cypress.Commands.add(
  'goToTaskListPage',
  require('../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage'),
);

Cypress.Commands.add('clickOnSubTaskLink', require('../support/common/clickOnSubTaskLink'));

Cypress.Commands.add(
  'verifyCompletedStatus',
  require('../support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('../support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayed',
  require('../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayedTextIsBlank',
  require('../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayedTextIsBlank'),
);

Cypress.Commands.add('verifyAppealDetailsSidebar', require('../support/common/verifyAppealDetailsSidebar'));

Cypress.Commands.add('getAppealDetailsSidebar', require('../support/common/getAppealDetailsSidebar'));

Cypress.Commands.add('clickSaveAndContinue', require('../support/common/clickSaveAndContinue'));

Cypress.Commands.add('clickSubmitButton', require('../support/common/clickSubmitButton'));

Cypress.Commands.add('clickBackButton', require('../support/common/clickBackButton'));

Cypress.Commands.add('validateErrorMessage', require('../support/common/validateErrorMessage'));
Cypress.Commands.add(
  'validateFileUploadErrorMessage',
  require('../support/common/validateFileUploadErrorMessage'),
);

Cypress.Commands.add('generateQuestionnaire', require('../support/common/generateQuestionnaire'));

Cypress.Commands.add('completeQuestionnaire', require('../support/common/completeQuestionnaire'));

Cypress.Commands.add('hasLink', require('../support/common/hasLink'));

Cypress.Commands.add(
  'downloadSubmissionPdf',
  require('../support/common/pdfFunctions').downloadSubmissionPdf,
);

Cypress.Commands.add(
  'checkSubmissionPdfContent',
  require('../support/common/pdfFunctions').checkSubmissionPdfContent,
);
