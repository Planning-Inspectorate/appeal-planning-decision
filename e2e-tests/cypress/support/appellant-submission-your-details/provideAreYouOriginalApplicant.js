module.exports = (value) => {
  cy.visit('/appellant-submission/original-applicant');
  if (value === 'are') {
    cy.get('[data-cy="answer-yes"]').check();
  } else {
    cy.get('[data-cy="answer-no"]').check();
  }
  cy.wait(Cypress.env('demoDelay'));
};
