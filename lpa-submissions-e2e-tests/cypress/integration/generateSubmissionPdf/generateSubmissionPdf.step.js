import { Then } from 'cypress-cucumber-preprocessor/steps';


Then('a PDF of the Check Your Answers page is created', () => {
  cy.verifyPage('information-submitted');

  let replyId;
  cy.getAppealReplyId().then((id) => (replyId = id));

  let pdfFile;

  // only run when in an environment with full access to APIs
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.request(
      'GET',
      `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/api/v1/reply/${replyId}`,
    ).then((response) => {
      const pdfId = response.body.submission.pdfStatement.uploadedFile.id;

      cy.request(
        'GET',
        `${Cypress.env('DOCUMENTS_SERVICE_BASE_URL')}/api/v1/${replyId}/${pdfId}/file`,
      ).then((response) => {
        pdfFile = response.body['application/pdf'];
      });
    });
  }

  if(pdfFile) {
    cy.task('getPdfContent', pdfFile).then(content => {
      expect(content).to.contain('Bob Smith');
      expect(content).to.contain('999 Letsby Avenue');
      expect(content).to.contain('Does the information from the appellant accurately reflect the original planning application?');
      expect(content).to.contain('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.');
    });
  }
});
