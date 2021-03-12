module.exports = (value) => {
  cy.visit('/appeal-householder-decision/who-are-you');
  if (value === 'are') {
    cy.get('[data-cy="answer-yes"]').check();
  } else {
    cy.get('[data-cy="answer-no"]').check();
  }
  cy.wait(Cypress.env('demoDelay'));
};
