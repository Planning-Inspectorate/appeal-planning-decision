module.exports = () => {
  cy.get('#have-other-owners-been-told-yes').click();

  cy.wait(Cypress.env('demoDelay'));
};
