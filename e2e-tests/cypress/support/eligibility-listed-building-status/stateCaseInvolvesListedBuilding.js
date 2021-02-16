module.exports = () => {
  cy.visit('/eligibility/listed-building');

  cy.get('#is-your-appeal-about-a-listed-building').click()


  cy.snapshot();
  const continueBtn = cy.get('.govuk-button').click();
  cy.snapshot();
}
