module.exports = () => {
  cy.get('.govuk-error-summary__list').should('not.exist');
};
