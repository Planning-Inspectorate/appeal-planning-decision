module.exports = (applicantName) => {
  cy.get('[name="behalf-appellant-name"]').should('have.value', applicantName);
  cy.wait(Cypress.env('demoDelay'));
};
