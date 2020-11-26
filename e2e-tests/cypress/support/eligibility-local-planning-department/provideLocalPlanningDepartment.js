module.exports = (text) => {
  cy.visit('/eligibility/planning-department');
  cy.get('input#planning-department-label').type(`{selectall}{backspace}${text}`);

  cy.wait(Cypress.env('demoDelay'));
  const continueBtn = cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));
}
