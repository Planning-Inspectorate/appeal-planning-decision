module.exports = () => {
  cy.visit('/eligibility/listed-building');

  cy.wait(Cypress.env('demoDelay'));
  cy.clickSaveAndContinue();
  cy.wait(Cypress.env('demoDelay'));
};
