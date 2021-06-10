module.exports = () => {
  cy.get('[data-cy="Feedback-Page-Body"]')
    .should('have.attr', 'href')
    .and(
      'include',
      'https://forms.office.com/Pages/ResponsePage.aspx?id=mN94WIhvq0iTIpmM5VcIjVqzqAxXAi1LghAWTH6Y3OJUOFg4UFdEUThGTlU3S0hFUTlERVYwMVRLTy4u',
    );

  cy.wait(Cypress.env('demoDelay'));
};
