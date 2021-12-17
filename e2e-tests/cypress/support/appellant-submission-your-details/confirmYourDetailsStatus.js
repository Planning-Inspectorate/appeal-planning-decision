module.exports = (value) => {
  cy.get('[yourdetails-status="' + value + '"]')
  cy.wait(Cypress.env('demoDelay'));
};
