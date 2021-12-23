export const agreeToTheDeclaration = () => {
  cy.get('[data-cy="appellant-confirmation"]').should('not.have.attr', 'checked');
  cy.get('[data-cy="appellant-confirmation"]').click();

  //cy.wait(Cypress.env('demoDelay'));
  cy.get('[data-cy="accept-and-send"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
