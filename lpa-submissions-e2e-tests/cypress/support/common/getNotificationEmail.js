module.exports = (emailAddress) => {
  let qs = {};
  if (emailAddress) qs.email_address = emailAddress;

  let options = {
    url: `${Cypress.env('EMAIL_NOTIFICATION_URL')}`,
    method: 'GET',
    qs: qs,
  };
  return cy.request(options);
};
