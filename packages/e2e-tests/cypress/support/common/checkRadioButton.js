export const checkRadioButton = (cyTag) => {
  cy.get(`[data-cy="${cyTag}"]`).check();
  cy.wait(Cypress.env('demoDelay'));
};
