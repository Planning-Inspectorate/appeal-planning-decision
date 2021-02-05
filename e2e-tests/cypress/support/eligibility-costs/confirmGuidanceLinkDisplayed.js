module.exports = () => {
  cy.get('[data-cy="appeal-awards-costs"]')
    .should('have.attr', 'target', '_blank')
    .should('have.attr', 'href','https://www.gov.uk/guidance/appeals#the-award-of-costs--general');

  cy.wait(Cypress.env('demoDelay'));
};
