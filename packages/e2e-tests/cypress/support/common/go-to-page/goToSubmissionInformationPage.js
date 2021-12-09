module.exports = () => {
  cy.visit('/appellant-submission/submission-information');
  cy.wait(Cypress.env('demoDelay'));
};
