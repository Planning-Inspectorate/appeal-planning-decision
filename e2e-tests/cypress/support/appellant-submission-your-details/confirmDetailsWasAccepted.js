module.exports = (name, email) => {
  // try to save and continue
  cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));

  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/applicant-name');
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
