module.exports = () => {
  //TODO validate this on the check-your-answers page once this is implemented
  cy.url().should('include','/appellant-submission/upload-application');

  cy.wait(Cypress.env('demoDelay'));
};
