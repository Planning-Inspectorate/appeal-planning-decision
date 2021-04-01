module.exports = () => {
  cy.get('.govuk-breadcrumbs').should('exist');
};
