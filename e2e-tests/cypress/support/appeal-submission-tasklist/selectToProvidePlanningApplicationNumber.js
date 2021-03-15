module.exports = () => {
  cy.get('a[href*="/appeal-householder-decision/application-number"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
