module.exports = () => {
  cy.goToAppellantSubmissionDecisionLetter();
  cy.get('#upload-decision-file-name').should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
