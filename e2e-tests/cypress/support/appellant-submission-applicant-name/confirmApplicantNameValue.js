module.exports = (applicantName) => {
  cy.goToApplicantNamePage();
  cy.wait(Cypress.env('demoDelay'));
  cy.get('#behalf-appellant-name').should('have.value', applicantName);
  cy.wait(Cypress.env('demoDelay'));
};
