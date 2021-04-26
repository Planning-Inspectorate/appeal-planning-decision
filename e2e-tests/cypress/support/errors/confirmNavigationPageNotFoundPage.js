module.exports = () => {
  cy.contains('Page not found');
  cy.wait(Cypress.env('demoDelay'));

  cy.get('[data-cy="Enquiries"]')
    .should('have.attr', 'href')
    .and('include', 'mailto:enquiries@planninginspectorate.gov.uk');

  cy.title().should('eq', 'Page not found - Appeal a householder planning decision - GOV.UK');
};
