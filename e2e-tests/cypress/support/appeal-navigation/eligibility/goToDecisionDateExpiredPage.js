module.exports = () => {
  cy.visit('/eligibility/decision-date-expired');
  cy.wait(Cypress.env('demoDelay'));
};
