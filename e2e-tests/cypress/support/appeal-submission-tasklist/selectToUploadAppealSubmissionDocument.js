module.exports = () => {
  cy.get('a[href*="/appellant-submission/upload-application"]').click();
  cy.snapshot();
};
