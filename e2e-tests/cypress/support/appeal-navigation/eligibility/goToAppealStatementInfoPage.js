module.exports = () => {
  cy.visit('/eligibility/appeal-statement');
  cy.wait(Cypress.env('demoDelay'));
};
