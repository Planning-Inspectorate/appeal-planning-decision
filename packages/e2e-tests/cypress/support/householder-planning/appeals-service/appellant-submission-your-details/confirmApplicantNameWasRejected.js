export const confirmApplicantNameWasRejected = (errorMessage) => {
  cy.url().should('include', '/appellant-submission/applicant-name');
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
 // cy.wait(Cypress.env('demoDelay'));
};
