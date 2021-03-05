module.exports = () => {
  cy.get('#have-other-owners-been-told-2').click();

  cy.wait(Cypress.env('demoDelay'));
};
