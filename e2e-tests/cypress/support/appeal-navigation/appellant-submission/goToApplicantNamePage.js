module.exports = () => {
  cy.visit('/appellant-submission/applicant-name');
  cy.wait(Cypress.env('demoDelay'));
};
