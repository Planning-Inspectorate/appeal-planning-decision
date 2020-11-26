module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/applicant-name');
  cy.wait(Cypress.env('demoDelay'));
};
