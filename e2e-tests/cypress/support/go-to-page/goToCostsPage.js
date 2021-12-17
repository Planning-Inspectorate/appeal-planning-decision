module.exports = () => {
  cy.visit('/eligibility/costs');
  cy.wait(Cypress.env('demoDelay'));
};
