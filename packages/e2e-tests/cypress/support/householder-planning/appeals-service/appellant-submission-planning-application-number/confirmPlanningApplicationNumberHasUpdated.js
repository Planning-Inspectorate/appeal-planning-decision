export const confirmPlanningApplicationNumberHasUpdated = (applicationNumber) => {
  cy.visit('/appellant-submission/application-number');
  cy.get('[data-cy="application-number"]').should('have.value', applicationNumber);
  //cy.wait(Cypress.env('demoDelay'));
};
