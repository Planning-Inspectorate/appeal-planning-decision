export const provideHouseholderPlanningPermissionStatusRefused = () => {
    cy.get('[data-cy="answer-refused"]').click();
    //cy.wait(Cypress.env('demoDelay'));
}
