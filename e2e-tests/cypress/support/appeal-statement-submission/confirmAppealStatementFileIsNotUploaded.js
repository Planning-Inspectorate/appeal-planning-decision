module.exports = () => {
  cy.goToAppealStatementSubmission();
  cy.get('#appeal-upload-file-name').should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
