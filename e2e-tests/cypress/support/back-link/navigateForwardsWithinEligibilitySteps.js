import { eligibleDate } from '../../integration/eligibility-decision-date/eligibility-decision-date';

module.exports = () => {
  cy.get('[data-cy="guidance-form-start"]').click();
  cy.wait(Cypress.env('demoDelay'));

  cy.provideHouseholderAnswerYes();
  cy.clickSaveAndContinue();

  cy.provideHouseholderPlanningPermissionStatusRefused();
  cy.clickSaveAndContinue();

  cy.provideDecisionDate(eligibleDate);
};
