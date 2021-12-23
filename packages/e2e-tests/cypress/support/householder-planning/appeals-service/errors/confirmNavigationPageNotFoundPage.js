export const confirmNavigationPageNotFoundPage = () => {
  cy.contains('Page not found');
  cy.get('[data-cy="Enquiries"]')
    .should('have.attr', 'href')
    .and('include', 'mailto:enquiries@planninginspectorate.gov.uk');

  cy.title().should('eq', 'Page not found - Appeal a householder planning decision - GOV.UK');
};
