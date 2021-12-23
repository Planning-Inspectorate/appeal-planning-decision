export const confirmHomepageLinkIsDisplayed = () => {
  cy.get('a.govuk-header__link--homepage')
    .should('have.attr', 'href')
    .and('include', 'https://www.gov.uk/');

  cy.wait(Cypress.env('demoDelay'));
};
