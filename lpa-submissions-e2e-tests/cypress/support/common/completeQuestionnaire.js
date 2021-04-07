module.exports = () => {
  cy.fixture('completedAppealReply').then((reply) => {
    const url = `${Cypress.env('appealReplyServiceUrl')}/api/v1/reply`;

    cy.request('POST', url, reply);
  });
};
