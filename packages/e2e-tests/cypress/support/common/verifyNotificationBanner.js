export const verifyNotificationBanner = (id, title, heading, body) => {
  cy.get(`[data-cy="${id}"]`).should('have.class', 'govuk-notification-banner');

  cy.get('#govuk-notification-banner-title').should('include.text', title);
  cy.get('p.govuk-notification-banner__heading').should('include.text', heading);
  cy.get('p.govuk-body').should('include.text', body);
};
