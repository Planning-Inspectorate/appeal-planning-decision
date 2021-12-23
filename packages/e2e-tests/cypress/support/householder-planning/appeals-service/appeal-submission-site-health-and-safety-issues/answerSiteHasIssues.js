export const answerSiteHasIssues = () => {
  cy.get('#site-access-safety').click();
  //cy.wait(Cypress.env('demoDelay'));
};
