module.exports = (name, email) => {
  cy.url().should('include', '/appellant-submission/applicant-name');
  cy.wait(Cypress.env('demoDelay'));
};
