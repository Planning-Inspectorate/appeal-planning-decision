export const confirmNavigationGrantedRefusedKickoutPage = () => {
  cy.url().should('include', '/eligibility/granted-or-refused-permission-out')
  //cy.wait(Cypress.env('demoDelay'));
}
