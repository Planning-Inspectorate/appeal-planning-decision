module.exports = (label) => {
  cy.get(`[data-cy="${label}"]`).within(() => {
    cy.get('.govuk-details__summary-text').click();
  })
  cy.wait(Cypress.env('demoDelay'));
};
