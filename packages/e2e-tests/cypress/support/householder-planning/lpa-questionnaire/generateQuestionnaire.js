export const generateQuestionnaire = () => {
  cy.get('@appeal').then((appeal) => {
   /* cy.request('GET',`${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/appeal/${appeal.id}`).then((response)=>{
      cy.log(response.body);
      cy.wrap(response.body).as('appealReply');
    })*/
  cy.request(
      'POST',
      `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/`,
      { appealId: appeal.id },
    ).then((response) => {
      expect(response.status).to.equal(
        201,
        'expect a happy response from the appeal-reply-api.post',
      );
      cy.wrap(response.body).as('appealReply');
    });
  });
};
