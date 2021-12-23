export const confirmUserPresentedWithProvidePlanningApplicationNumber = () => {
  cy.url().should('contain','/appellant-submission/application-number');
  //cy.wait(Cypress.env('demoDelay'));
};
