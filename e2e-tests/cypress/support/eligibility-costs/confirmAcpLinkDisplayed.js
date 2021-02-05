module.exports = () => {
  cy.get('[data-cy="appeal-decision-service"]')
    .should('have.attr', 'href', 'https://acp.planninginspectorate.gov.uk/');

  cy.wait(Cypress.env('demoDelay'));
};
