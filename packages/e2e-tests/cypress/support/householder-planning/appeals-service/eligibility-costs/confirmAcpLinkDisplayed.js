export const confirmAcpLinkDisplayed = () => {
  cy.get('[data-cy="appeal-decision-service"]')
    .should('have.attr', 'href', 'https://acp.planninginspectorate.gov.uk/');
  // cy.wait(Cypress.env('demoDelay'));
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
};
