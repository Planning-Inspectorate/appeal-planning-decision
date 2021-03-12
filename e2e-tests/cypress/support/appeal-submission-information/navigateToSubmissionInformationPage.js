module.exports = () => {
  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .then((appealId) => {
      cy.visit(`/appeal-householder-decision/submission-information/${appealId}`, {
        failOnStatusCode: false,
      });
      cy.wait(Cypress.env('demoDelay'));
    });
};
