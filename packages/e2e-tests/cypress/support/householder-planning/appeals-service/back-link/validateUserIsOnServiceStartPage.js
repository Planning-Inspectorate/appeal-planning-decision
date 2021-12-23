export const validateUserIsOnServiceStartPage = () => {
  cy.url().should('match', /\/before-you-appeal$/);
};
