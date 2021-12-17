module.exports = () => {
  cy.get('[data-cy="Terms and conditions"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/guidance/appeals-casework-portal-terms-and-conditions');

  cy.wait(Cypress.env('demoDelay'));
};
