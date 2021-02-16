module.exports = () => {
  cy.get('[data-cy="Feedback"]')
    .should('have.attr', 'href')
    .and('include', 'https://www.smartsurvey.co.uk/s/7OGXZZ/');

  cy.snapshot();
};
