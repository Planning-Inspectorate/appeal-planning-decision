module.exports = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#decision-date-${input}`).should('have.class','govuk-input--error');
  });

  cy.wait(Cypress.env('demoDelay'))
}
