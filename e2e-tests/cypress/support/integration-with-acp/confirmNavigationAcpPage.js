module.exports = () => {
  cy.url().should('eq', 'https://acp.planninginspectorate.gov.uk/');
  cy.snapshot();
}
