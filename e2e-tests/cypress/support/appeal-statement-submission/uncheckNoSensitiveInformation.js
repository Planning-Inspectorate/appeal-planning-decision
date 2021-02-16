module.exports = () => {
  cy.get('#does-not-include-sensitive-information').uncheck();
  cy.snapshot();
};
