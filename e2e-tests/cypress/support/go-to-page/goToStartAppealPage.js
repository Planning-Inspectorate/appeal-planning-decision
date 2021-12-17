module.exports = () => {
  cy.visit('/eligibility/');
  cy.wait(Cypress.env('demoDelay'));
};
