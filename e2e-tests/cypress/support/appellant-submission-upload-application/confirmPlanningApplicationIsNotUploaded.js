module.exports = () => {
  cy.goToPlanningApplicationSubmission();
  cy.get('#application-upload-file-name').should('not.exist');
  cy.snapshot();
};
