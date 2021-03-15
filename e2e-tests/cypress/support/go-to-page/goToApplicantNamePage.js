module.exports = () => {
  cy.visit('/appeal-householder-decision/applicant-name', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
