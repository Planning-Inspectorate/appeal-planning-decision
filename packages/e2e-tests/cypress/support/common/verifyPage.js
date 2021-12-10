export const verifyPage = (url) => {
  cy.url().should('include', url);
};
