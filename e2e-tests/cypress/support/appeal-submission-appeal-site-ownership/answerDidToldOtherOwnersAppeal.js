module.exports = () => {
  cy.get('#have-other-owners-been-told').click();

  cy.wait(Cypress.env('demoDelay'));
};
