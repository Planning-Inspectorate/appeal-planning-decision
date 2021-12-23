export const confirmLocalPlanningDepartmentIsNotParticipating = (text) => {
  cy.wait(Cypress.env('demoDelay'));

  cy.get('h1')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('This service is not available in your area');
    });

  cy.get('[data-cy="linkToAlternativeService"]')
    .should('have.attr', 'href')
    .and('include', 'https://acp.planninginspectorate.gov.uk/myportal/default.aspx');
  //cy.wait(Cypress.env('demoDelay'));
 };
