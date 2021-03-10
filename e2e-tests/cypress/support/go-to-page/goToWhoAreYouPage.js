module.exports = () => {
  cy.visit('/appellant-submission/original-applicant', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
