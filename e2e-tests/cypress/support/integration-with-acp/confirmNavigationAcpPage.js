module.exports = () => {
  cy.url().should('eq', 'https://acp.planninginspectorate.gov.uk/');
  cy.wait(Cypress.env('demoDelay'));
}
