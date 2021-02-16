module.exports = () => {
  cy.get('[data-cy="Feedback-Page-Body"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.smartsurvey.co.uk/s/7OGXZZ/');

  cy.snapshot();
};
