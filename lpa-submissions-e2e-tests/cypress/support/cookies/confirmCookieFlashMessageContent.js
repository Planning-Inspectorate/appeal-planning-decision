module.exports = ({ cyTag, title, body, link }) => {
  cy.get(`[data-cy="${cyTag}"]`).should('exist');

  cy.get('#govuk-notification-banner-title')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(title);
    });

  cy.get('[data-cy="cookies-updated-body-text"]')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(body);
    });

  if (typeof link === 'undefined') {
    cy.get('[data-cy="cookies-updated-go-back-link"]').should('not.exist');
  } else {
    cy.get('[data-cy="cookies-updated-go-back-link"]')
      .invoke('attr', 'href')
      .then((href) => {
        expect(href).to.contain(link);
      });
  }

  cy.wait(Cypress.env('demoDelay'));
};
