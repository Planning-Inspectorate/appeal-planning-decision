export const validateBreadcrumbsAreVisible = () => {
  cy.get('.govuk-breadcrumbs').should('exist');
};
