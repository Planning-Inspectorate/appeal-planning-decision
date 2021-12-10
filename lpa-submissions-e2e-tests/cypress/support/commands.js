import '@testing-library/cypress/add-commands';
require('cypress-file-upload');
require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/visit-without-javascript-enabled');
require('./accessibility');

Cypress.Commands.add('goToPage', require('../../../packages/e2e-tests/cypress/support/common/goToPage'));

Cypress.Commands.add('verifySectionName', require('../../../packages/e2e-tests/cypress/support/common/verifySectionName'));

Cypress.Commands.add('visibleWithText', require('../../../packages/e2e-tests/cypress/support/common/visibleWithText'));

Cypress.Commands.add('visibleWithoutText', require('../../../packages/e2e-tests/cypress/support/common/visibleWithoutText'));

Cypress.Commands.add('getAppealReplyId', require('../../../packages/e2e-tests/cypress/support/common/getAppealReplyId'));

Cypress.Commands.add(
  'goToTaskListPage',
  require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/goToTaskListPage'),
);

Cypress.Commands.add('clickOnSubTaskLink', require('../../../packages/e2e-tests/cypress/support/common/clickOnSubTaskLink'));

Cypress.Commands.add(
  'verifyCompletedStatus',
  require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/appeals-questionnaire-tasklist/verifyCompletedStatus'),
);

Cypress.Commands.add(
  'goToCheckYourAnswersPage',
  require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayed',
  require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed'),
);

Cypress.Commands.add(
  'confirmCheckYourAnswersDisplayedTextIsBlank',
  require('../../../packages/e2e-tests/cypress/support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayedTextIsBlank'),
);

Cypress.Commands.add('verifyAppealDetailsSidebar', require('../../../packages/e2e-tests/cypress/support/common/verifyAppealDetailsSidebar'));

Cypress.Commands.add('getAppealDetailsSidebar', require('../../../packages/e2e-tests/cypress/support/common/getAppealDetailsSidebar'));

Cypress.Commands.add('clickSaveAndContinue', require('../../../packages/e2e-tests/cypress/support/common/clickSaveAndContinue'));

Cypress.Commands.add('clickSubmitButton', require('../../../packages/e2e-tests/cypress/support/common/clickSubmitButton'));

Cypress.Commands.add('clickBackButton', require('../../../packages/e2e-tests/cypress/support/common/clickBackButton'));

Cypress.Commands.add('validateErrorMessage', require('../../../packages/e2e-tests/cypress/support/common/validateErrorMessage'));
Cypress.Commands.add(
  'validateFileUploadErrorMessage',
  require('../../../packages/e2e-tests/cypress/support/common/validateFileUploadErrorMessage'),
);

Cypress.Commands.add('generateQuestionnaire', require('../../../packages/e2e-tests/cypress/support/common/generateQuestionnaire'));

Cypress.Commands.add('completeQuestionnaire', require('../../../packages/e2e-tests/cypress/support/common/completeQuestionnaire'));

Cypress.Commands.add('hasLink', require('../../../packages/e2e-tests/cypress/support/common/hasLink'));

Cypress.Commands.add(
  'downloadSubmissionPdf',
  require('../../../packages/e2e-tests/cypress/support/common/pdfFunctions').downloadSubmissionPdf,
);

Cypress.Commands.add(
  'checkSubmissionPdfContent',
  require('../../../packages/e2e-tests/cypress/support/common/pdfFunctions').checkSubmissionPdfContent,
);
