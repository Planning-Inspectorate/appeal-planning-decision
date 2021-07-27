module.exports = (id, title, body) => {
  return cy
    .get(`[data-cy="${id}"]`)
    .should('have.class', 'govuk-notification-banner')
    .then((banner) => {
      banner.get('.govuk-notification-banner__title').should('have.text', title);
      banner.get('.govuk-notification-banner__content').should('have.text', body);
    });
};
