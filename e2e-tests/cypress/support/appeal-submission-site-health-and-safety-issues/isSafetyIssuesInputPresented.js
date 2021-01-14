module.exports = (isPresented) => {
  const isVisible = isPresented ? 'be.visible' : 'not.be.visible';
  cy.get('#site-access-safety-concerns').should(isVisible);
  cy.wait(Cypress.env('demoDelay'));
};
