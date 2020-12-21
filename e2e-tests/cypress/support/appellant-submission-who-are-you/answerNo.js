module.exports = () => {
  cy.get('#are-you-the-original-appellant-2').click();

  cy.wait(Cypress.env('demoDelay'));
};
