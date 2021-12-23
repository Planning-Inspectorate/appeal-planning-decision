export const assertIsYourPlanningAppealPage = ({ appealId }) => {
  cy.title().should('eq', 'Your planning appeal - Appeal a householder planning decision - GOV.UK');

  cy.url().should('match', new RegExp(`\/your-planning-appeal\/${appealId}$`));

  cy.get('[data-cy="page-heading"]')
    .invoke('text')
    .then((text) => text.trim())
    .should('eq', 'Your planning appeal');
};
