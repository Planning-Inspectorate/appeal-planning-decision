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
Cypress.Commands.add('checkPageA11y', () => {
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
  'goToTaskListPage',
  require('./appeals-questionnaire-tasklist/goToTaskListPage'),
);

Cypress.Commands.add('goToPage', require('./common/goToPage'));

Cypress.Commands.add('verifyPage', require('./common/verifyPage'));

Cypress.Commands.add('verifyPageHeading', require('./common/verifyPageHeading'));

Cypress.Commands.add('verifyPageTitle', require('./common/verifyPageTitle'));

Cypress.Commands.add('verifySectionName', require('./common/verifySectionName'));

Cypress.Commands.add(
  'clickOnTaskListLink',
  require('./appeals-questionnaire-tasklist/clickOnTaskListLink'),
);

Cypress.Commands.add(
  'verifyCompletedStatus',
  require('./appeals-questionnaire-tasklist/verifyCompletedStatus'),
);

Cypress.Commands.add('verifyAppealDetailsSidebar', require('./common/verifyAppealDetailsSidebar'));

Cypress.Commands.add('getAppealDetailsSidebar', require('./common/getAppealDetailsSidebar'));

Cypress.Commands.add('clickSaveAndContinue', require('./common/clickSaveAndContinue'));

Cypress.Commands.add('clickBackButton', require('./common/clickBackButton'));

Cypress.Commands.add('validateErrorMessage', require('./common/validateErrorMessage'));
