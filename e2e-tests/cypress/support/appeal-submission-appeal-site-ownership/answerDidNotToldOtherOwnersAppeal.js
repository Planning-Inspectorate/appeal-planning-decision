module.exports = () => {
  cy.get('#have-other-owners-been-told-no').click();

  cy.wait(Cypress.env('demoDelay'));
};
