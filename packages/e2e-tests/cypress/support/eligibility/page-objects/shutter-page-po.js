export const getACPLink = () => cy.findByRole('link',{name:'appeal using our appeals casework portal'});
export const getAppealDeadline = () => cy.get('[data-cy=appeal-deadline]');
