module.exports = (value) => {
  cy.get('[yourdetails-status="' + value + '"]')
  cy.snapshot();
};
