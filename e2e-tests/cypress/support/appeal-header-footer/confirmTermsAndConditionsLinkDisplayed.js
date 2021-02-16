module.exports = () => {
  cy.get('[data-cy="Terms and conditions"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/government/publications/appeals-portal-documents');

  cy.snapshot();
};
