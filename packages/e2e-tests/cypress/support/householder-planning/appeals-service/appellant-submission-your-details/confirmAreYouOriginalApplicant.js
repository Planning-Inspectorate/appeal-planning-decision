export const confirmAreYouOriginalApplicant= (value) => {
  switch (value) {
    case 'yes':
      cy.get('[data-cy="answer-yes"]').should('be.checked');
      break;
    case 'no':
      cy.get('[data-cy="answer-no"]').should('be.checked');
      break;
    default:
      cy.get('[data-cy="answer-yes"]').should('not.be.checked');
      cy.get('[data-cy="answer-no"]').should('not.be.checked');
  }
  //cy.wait(Cypress.env('demoDelay'));
};
