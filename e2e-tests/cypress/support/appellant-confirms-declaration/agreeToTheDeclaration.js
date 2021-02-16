module.exports = () => {
  cy.get('[data-cy="appellant-confirmation"]').should('not.have.attr', 'checked');
  cy.get('[data-cy="appellant-confirmation"]').click();

  cy.snapshot();
  cy.get('[data-cy="accept-and-send"]').click();
  cy.snapshot();
};
