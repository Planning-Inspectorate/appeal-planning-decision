module.exports = (name, email) => {
  // try to save and continue
  cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));

  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/applicant-name');
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));

  // prove that the entered data is retained during navigation
  // -> use the provided 'back' button
  cy.get('[data-cy="back"]').click();
  cy.get('#appellant-name').should('have.value', name);
  cy.get('#appellant-email').should('have.value', email);
  cy.wait(Cypress.env('demoDelay'));
};
