export const confirmBackButtonDisplayed = () => {
  cy.get('.govuk-back-link').should('exist');
};
