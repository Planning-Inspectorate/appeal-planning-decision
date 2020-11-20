module.exports = () => {
  cy.goToAppealStatementSubmission();
  cy.get('#appeal-statement-file-name').should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
