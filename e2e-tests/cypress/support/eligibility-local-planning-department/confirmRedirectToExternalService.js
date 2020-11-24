module.exports = (text) => {
  cy.get('[data-cy="linkToAlternativeService"]').invoke('attr', 'href').then((href) => {
    expect(href).to.equal("https://acp.planninginspectorate.gov.uk/myportal/default.aspx");
  });

  cy.wait(Cypress.env('demoDelay'));
}
