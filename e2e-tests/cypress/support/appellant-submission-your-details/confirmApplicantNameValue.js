module.exports = (applicantName) => {
  cy.goToApplicantNamePage();
  cy.snapshot();
  cy.get('#behalf-appellant-name').should('have.value', applicantName);
  cy.snapshot();
};
