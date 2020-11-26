module.exports = (answer) => {
  cy.get('#are-you-the-original-appellant').click();

  cy.wait(Cypress.env('demoDelay'));
};
