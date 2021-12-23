export const confirmPrivacyLinkDisplayed = () => {
  cy.get('[data-cy="Privacy"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/guidance/appeals-casework-portal-privacy-cookies');

  cy.wait(Cypress.env('demoDelay'));
};
