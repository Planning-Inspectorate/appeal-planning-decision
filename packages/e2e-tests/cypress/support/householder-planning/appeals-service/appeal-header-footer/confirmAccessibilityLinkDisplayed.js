export const confirmAccessibilityLinkDisplayed = () => {
  cy.get('[data-cy="Accessibility"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/guidance/appeals-casework-portal-accessibility');

  //cy.wait(Cypress.env('demoDelay'));
};
