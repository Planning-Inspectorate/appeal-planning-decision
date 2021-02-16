module.exports = () => {
  cy.visit('/appellant-submission/check-answers', { failOnStatusCode: false });
  cy.snapshot();
};
