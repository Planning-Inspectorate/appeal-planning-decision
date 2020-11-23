module.exports = () => {
  cy.visit('/eligibility/listed-building');

  cy.wait(Cypress.env('demoDelay'));
  const continueBtn = cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));
}
