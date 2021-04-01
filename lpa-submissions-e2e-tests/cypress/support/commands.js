const severityIndicators = {
  minor: '🟢 Minor',
  moderate: '🟡 Moderate',
  serious: '🟠 Serious',
  critical: '🔴 Critical',
};

function callback(violations) {
  violations.forEach((violation) => {
    const nodes = Cypress.$(violation.nodes.map((node) => node.target).join(','));

    Cypress.log({
      name: `${severityIndicators[violation.impact]} A11Y`,
      consoleProps: () => violation,
      $el: nodes,
      message: `[${violation.help}](${violation.helpUrl})`,
    });

    violation.nodes.forEach(({ target }) => {
      Cypress.log({
        name: '🔧 Fix',
        consoleProps: () => violation,
        $el: Cypress.$(target.join(',')),
        message: target,
      });
    });
  });
}

Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then((window) => {
    const axe = require('axe-core/axe.js');
    const script = window.document.createElement('script');
    script.innerHTML = axe.source;
    window.document.head.appendChild(script);
  });
});
Cypress.Commands.add('checkPageA11y', (path) => {
  //cy.visit(path);
  cy.injectAxe();
  cy.checkA11y(
    {
      exclude: ['.govuk-radios__input'],
    },
    null,
    callback,
  );
});

Cypress.Commands.add(
  'validatePageHolderPageLoad',
  require('./appeals-questionnaire-navigation/validatePageHolderPageLoad'),
);

Cypress.Commands.add(
  'goToAppealsQuestionnaireTasklistPage',
  require('./appeals-questionnaire-tasklist/goToAppealsQuestionnaireTasklistPage'),
);

Cypress.Commands.add('goToPage', require('./common/goToPage'));

Cypress.Commands.add('verifyPage', require('./common/verifyPage'));

Cypress.Commands.add('verifyPageHeading', require('./common/verifyPageHeading'));

Cypress.Commands.add('verifyPageTitle', require('./common/verifyPageTitle'));

Cypress.Commands.add('verifySectionName', require('./common/verifySectionName'));

Cypress.Commands.add(
  'verifyTaskListPageTitle',
  require('./appeals-questionnaire-tasklist/verifyTaskListPageTitle'),
);

Cypress.Commands.add(
  'goToTellUsAboutAppealSitePage',
  require('./appeals-questionnaire-navigation/goToTellUsAboutAppealSitePage'),
);

Cypress.Commands.add(
  'goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage',
  require('./appeals-questionnaire-navigation/goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage'),
);

Cypress.Commands.add(
  'goToNotifyingInterestedPartiesOfTheAppealPage',
  require('./appeals-questionnaire-navigation/goToNotifyingInterestedPartiesOfTheAppealPage'),
);

Cypress.Commands.add(
  'clickOnLinksOnAppealQuestionnaireTaskListPage',
  require('./appeals-questionnaire-tasklist/clickOnLinksOnAppealQuestionnaireTaskListPage'),
);

Cypress.Commands.add(
  'goToOtherRelevantPoliciesPage',
  require('./appeals-questionnaire-navigation/goToOtherRelevantPoliciesPage'),
);

Cypress.Commands.add(
  'goToPlanningHistoryPage',
  require('./appeals-questionnaire-navigation/goToPlanningHistoryPage'),
);

Cypress.Commands.add(
  'goToRepresentationsFromInterestedPartiesPage',
  require('./appeals-questionnaire-navigation/goToRepresentationsFromInterestedPartiesPage'),
);

Cypress.Commands.add(
  'goToSiteNoticesPage',
  require('./appeals-questionnaire-navigation/goToSiteNoticesPage'),
);

Cypress.Commands.add(
  'goToStatutoryDevelopmentPlanPolicyPage',
  require('./appeals-questionnaire-navigation/goToStatutoryDevelopmentPlanPolicyPage'),
);

Cypress.Commands.add(
  'goToSupplementaryPlanningDocumentsExtractPage',
  require('./appeals-questionnaire-navigation/goToSupplementaryPlanningDocumentsExtractPage'),
);

Cypress.Commands.add(
  'goToTellingInterestedPartiesAboutTheApplicationPage',
  require('./appeals-questionnaire-navigation/goToTellingInterestedPartiesAboutTheApplicationPage'),
);

Cypress.Commands.add(
  'goToUploadPlanningOfficersReportPage',
  require('./appeals-questionnaire-navigation/goToUploadPlanningOfficersReportPage'),
);

Cypress.Commands.add(
  'goToUploadThePlansUsedToReachDecisionPage',
  require('./appeals-questionnaire-navigation/goToUploadThePlansUsedToReachDecisionPage'),
);

Cypress.Commands.add(
  'verifyNotStartedStatus',
  require('./appeals-questionnaire-navigation/verifyNotStartedStatus'),
);

Cypress.Commands.add(
  'verifyCompletedStatus',
  require('./appeals-questionnaire-tasklist/verifyCompletedStatus'),
);

Cypress.Commands.add(
  'checkYourAnswers',
  require('./appeals-questionnaire-navigation/checkYourAnswers'),
);

Cypress.Commands.add(
  'verifyCannotStartStatus',
  require('./appeals-questionnaire-navigation/verifyCannotStartStatus'),
);

Cypress.Commands.add('verifyAppealDetailsSidebar', require('./common/verifyAppealDetailsSidebar'));

Cypress.Commands.add('getAppealDetailsSidebar', require('./common/getAppealDetailsSidebar'));

Cypress.Commands.add('clickSaveAndContinue', require('./common/clickSaveAndContinue'));

Cypress.Commands.add('clickBackButton', require('./common/clickBackButton'));

Cypress.Commands.add('validateErrorMessage', require('./common/validateErrorMessage'));
