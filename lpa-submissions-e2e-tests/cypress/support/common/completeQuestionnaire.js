module.exports = () => {
  // Visit task list page to invoke session, which generates an appeal reply ID
  cy.goToTaskListPage();

  let id
  cy.getAppealReplyId().then(replyId => id = replyId);

  cy.fixture('completedAppealReply.json').then((reply) => {
    cy.request(
      'PUT',
      `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/api/v1/reply/${id}`,
      reply
    ).then(response => {
      expect(response.body.aboutAppealSection.submissionAccuracy).to.have.property('accurateSubmission', false);
    });
  });
};
