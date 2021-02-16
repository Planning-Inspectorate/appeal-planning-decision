module.exports = () => {
  cy.url().should('include', '/eligibility/enforcement-notice');

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Select Yes if you’ve received an enforcement notice');
    });

  cy.snapshot();
};
