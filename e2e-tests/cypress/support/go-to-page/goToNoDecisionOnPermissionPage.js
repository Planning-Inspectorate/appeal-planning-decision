module.exports = () => {
  cy.visit('/eligibility/no-decision');
  cy.wait(Cypress.env('demoDelay'));
};
