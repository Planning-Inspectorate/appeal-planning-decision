module.exports = () => {
  cy.visit('/eligibility/listed-building');

  cy.snapshot();
  const continueBtn = cy.get('.govuk-button').click();
  cy.snapshot();
}
