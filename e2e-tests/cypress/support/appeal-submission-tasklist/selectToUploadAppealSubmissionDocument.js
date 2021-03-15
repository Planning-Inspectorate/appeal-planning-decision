module.exports = () => {
  cy.get('a[href*="/appeal-householder-decision/upload-application"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
