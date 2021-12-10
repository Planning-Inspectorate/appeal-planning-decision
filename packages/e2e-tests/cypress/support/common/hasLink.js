export const hasLink= (selector, linkUrl) => {
  cy.get(selector)
    .should('have.attr', 'href')
    .and('include', linkUrl);
};
