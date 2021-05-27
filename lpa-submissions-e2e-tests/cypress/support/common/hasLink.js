module.exports = (dataCy, linkUrl) => {
  cy.get(`[data-cy=${dataCy}]`)
    .should('have.attr', 'href')
    .and('include', linkUrl);
};
