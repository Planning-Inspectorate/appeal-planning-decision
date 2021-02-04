module.exports = () => {
  cy.visit('/eligibility/decision-date-passed');
  cy.wait(Cypress.env('demoDelay'));
};
