Cypress.Commands.add(
  'assertHasLinkToViewYourAppealDetails',
  require('./assertHasLinkToViewYourAppealDetails'),
);

Cypress.Commands.add(
  'appellantViewsYourAppealDetails',
  require('./appellantViewsYourAppealDetails'),
);

Cypress.Commands.add(
  'appellantViewsYourAppealDetailsInvalid',
  require('./appellantViewsYourAppealDetailsInvalid'),
);

Cypress.Commands.add(
  'assertYourAppealDetailsAccordionPanelStatus',
  require('./assertYourAppealDetailsAccordionPanelStatus'),
);

Cypress.Commands.add(
  'toggleAllYourAppealDetailsAccordionPanels',
  require('./toggleAllYourAppealDetailsAccordionPanels'),
);

Cypress.Commands.add(
  'toggleIndividualYourAppealDetailsAccordionPanel',
  require('./toggleIndividualYourAppealDetailsAccordionPanel'),
);

/**
 * THIS WHOLE SECTION NEEDS REPLACING WITH DANS SOLUTION
 *
 * @see https://github.com/Planning-Inspectorate/appeal-planning-decision/compare/feature/as-1903-session-handling-for-lpa-questionnaire
 */

Cypress.Commands.add(
  'createAppellantAppealWithoutFiles',
  require('./to-replace-with-api-calls/createAppellantAppealWithoutFiles'),
);

Cypress.Commands.add(
  'createAppellantAppealWithFiles',
  require('./to-replace-with-api-calls/createAppellantAppealWithFiles'),
);

Cypress.Commands.add(
  'createAgentAppealWithoutFiles',
  require('./to-replace-with-api-calls/createAgentAppealWithoutFiles'),
);

Cypress.Commands.add(
  'createAgentAppealWithFiles',
  require('./to-replace-with-api-calls/createAgentAppealWithFiles'),
);

// ---------------------- end --------------------------
