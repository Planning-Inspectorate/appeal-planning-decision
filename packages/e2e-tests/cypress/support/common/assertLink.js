export const assertLink = ({ cyTag, href, title, text }) => {
  cy.get(`[data-cy="${cyTag}"]`)
    .should('have.attr', 'href')
    .should('not.be.empty')
    .and('contain', href);

  cy.get(`[data-cy="${cyTag}"]`).contains(text);

  if (title) {
    cy.get(`[data-cy="${cyTag}"]`)
      .should('have.attr', 'title')
      .should('not.be.empty')
      .and('contain', title);
  }
};
