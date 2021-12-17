module.exports = () => {
  cy.url().should('contain','/appellant-submission/upload-application');
  cy.wait(Cypress.env('demoDelay'));
};
