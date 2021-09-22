module.exports = () => {
  cy.url().should('include', '/eligibility/no-decision');
  cy.wait(2000);
  const serviceTxt = cy.get('.govuk-heading-l');
  assert.exists(serviceTxt, 'This service is only for householder content exists');
  const contentTxt = cy.get('.govuk-body');
  assert.exists(contentTxt, 'If you applied for householder planning permission content exists');
  cy.get('[data-cy="appeal-decision-service"]').invoke('attr', 'href').then((href) => {
    expect(href).to.contain("https://acp.planninginspectorate.gov.uk/");
  });
  cy.wait(Cypress.env('demoDelay'));
}
