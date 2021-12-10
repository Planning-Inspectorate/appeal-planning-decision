export const assertCyTagHasExactText = (expectations) => {
  Object.entries(expectations).forEach(([key, expectedValue]) => {
    cy.log({ key, expectedValue });
    cy.get(`[data-cy='${key}']`)
      .invoke('text')
      .then((text) => text.trim())
      .should('eq', expectedValue);
  });

  cy.wait(Cypress.env('demoDelay'));
};
