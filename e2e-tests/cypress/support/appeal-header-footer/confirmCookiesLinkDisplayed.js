module.exports = () => {
  cy.get('[data-cy="Cookies"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/guidance/appeals-casework-portal-privacy-cookies');

  cy.wait(Cypress.env('demoDelay'));
};
