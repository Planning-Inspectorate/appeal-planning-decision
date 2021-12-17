module.exports = () => {
  cy.get('a[href*="/appellant-submission/upload-application"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
