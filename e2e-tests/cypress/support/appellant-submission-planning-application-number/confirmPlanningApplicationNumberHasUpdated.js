module.exports = (applicationNumber) => {
  //TODO validate this on the check-your-answers page once this is implemented
  cy.url().should('include','/appellant-submission/upload-application');

  cy.wait(Cypress.env('demoDelay'));

  // revisit the application number page and prove the number is still there..
  cy.visit('/appellant-submission/application-number');

  cy.get('[data-cy="application-number"]').should('have.value', applicationNumber);

  cy.wait(Cypress.env('demoDelay'));

};
