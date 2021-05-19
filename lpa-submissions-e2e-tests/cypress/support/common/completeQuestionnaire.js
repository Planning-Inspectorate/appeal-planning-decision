const completeQuestionnaire = () => {
  cy.get('@appealReply').then((appealReply) => {
    cy.fixture('completedAppealReply.json').then((reply) => {
      reply.id = appealReply.id;
      reply.appealId = appealReply.appealId;
      cy.request(
        'PUT',
        `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/${appealReply.id}`,
        reply,
      ).then((response) => {
        expect(response.status).to.equal(
          200,
          'expect a happy response from the appeal-reply-api.update',
        );
      });
    });
  });
};

export default completeQuestionnaire;
