module.exports = () => {
  cy.get('a[href*="/appellant-submission/application-number"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
