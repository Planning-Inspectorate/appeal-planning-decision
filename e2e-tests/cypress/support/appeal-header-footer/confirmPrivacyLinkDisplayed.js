module.exports = () => {
  cy.get('[data-cy="Privacy"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/government/publications/appeals-portal-documents');

  cy.snapshot();
};
