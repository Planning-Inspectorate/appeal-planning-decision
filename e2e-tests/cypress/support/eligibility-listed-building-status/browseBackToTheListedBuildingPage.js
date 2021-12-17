module.exports = () => {
  // prove that the entered data is retained during navigation
  // -> use the provided 'back' button
  cy.clickBackLink();

  cy.wait(Cypress.env('demoDelay'));
};
