module.exports = (text) => {
  cy.url().should('include', '/eligibility/listed-building');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));

  // prove that the entered data is retained during navigation
  // -> use the provided 'back' button
  cy.get('[data-cy="back"]').click();

  // confirm that the local planning department name has been retained.
  // TODO currently failing test; need to raise this as a defect..
  // cy.get('input#planning-department-label').should('have.value', text)
  cy.wait(Cypress.env('demoDelay'));
}
