module.exports = () => {
  cy.visit('/appellant-submission/applicant-name', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
