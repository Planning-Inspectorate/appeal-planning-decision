module.exports = () => {
  cy.visit('/eligibility/decision-date');
  cy.wait(Cypress.env('demoDelay'));
};
