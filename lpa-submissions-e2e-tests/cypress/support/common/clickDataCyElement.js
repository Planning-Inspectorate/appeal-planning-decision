module.exports = (dataCy) => {
  cy.get(`[data-cy=${dataCy}]`).click();
};
