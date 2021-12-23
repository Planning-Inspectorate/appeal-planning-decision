export const confirmPlanningApplicationNumberHasNotUpdated = () => {
  cy.visit('/appellant-submission/application-number');
  cy.get('[data-cy="application-number"].value').should('not.exist');
  //cy.wait(Cypress.env('demoDelay'));
};
