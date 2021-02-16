module.exports = () => {
  cy.visit('/appellant-submission/who-are-you', {failOnStatusCode: false});
  cy.snapshot();
};
