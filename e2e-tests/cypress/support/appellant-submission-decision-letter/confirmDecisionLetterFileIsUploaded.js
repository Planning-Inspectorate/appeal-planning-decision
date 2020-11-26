module.exports = (filename) => {
  cy.goToAppellantSubmissionDecisionLetter();
  cy.get('#upload-decision-file-name').invoke('text').then((text) => {
    expect(text).to.eq(filename);
  });
  cy.wait(Cypress.env('demoDelay'));
};
