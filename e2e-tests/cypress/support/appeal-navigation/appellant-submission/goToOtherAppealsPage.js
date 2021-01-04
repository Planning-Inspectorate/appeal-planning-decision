module.exports = () => {
  cy.visit('/appellant-submission/other-appeals');
  cy.wait(Cypress.env('demoDelay'));
};
