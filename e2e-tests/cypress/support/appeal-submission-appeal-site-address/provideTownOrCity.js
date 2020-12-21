module.exports = (townOrCity) => {
  // provide the town or city
  cy.get('#site-town-city').type(`{selectall}{backspace}${townOrCity}`);

  cy.wait(Cypress.env('demoDelay'));
};
