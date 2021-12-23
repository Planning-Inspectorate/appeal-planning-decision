export const accessDetails = (label) => {
  cy.get(`[data-cy="${label}"]`).within(() => {
    cy.get('.govuk-details__summary-text').click();
  })
};
