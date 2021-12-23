export const accessSection = (sectionName) => {
  cy.get(`[data-cy="${sectionName}"]`).click();
  //cy.wait(Cypress.env('demoDelay'));
};
