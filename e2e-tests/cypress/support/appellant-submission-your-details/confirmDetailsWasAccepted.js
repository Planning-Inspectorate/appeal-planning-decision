module.exports = (name, email) => {
  cy.url().should('include', '/appeal-householder-decision/applicant-name');
  cy.wait(Cypress.env('demoDelay'));
};
