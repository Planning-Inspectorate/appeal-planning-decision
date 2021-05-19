import { Then } from 'cypress-cucumber-preprocessor/steps';
import ignoreAddedFormatting from '../../support/common/ignoreAddedFormatting'

Then('a PDF of the Check Your Answers page is created', () => {
  cy.verifyPage('information-submitted');

  let pdfFile;

  // only run when in an environment with full access to APIs
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.getAppealReplyId().then((replyId) => {
      cy.request(
        'GET',
        `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/${replyId}`,
      ).then((response) => {
        const pdfId = response.body.submission.pdfStatement.uploadedFile.id;
        const fileName = `${replyId}.pdf`

        cy.downloadFile(
          `${Cypress.env('DOCUMENT_SERVICE_BASE_URL')}/${replyId}/${pdfId}/file`,
          'cypress/fixtures/downloads',
          fileName
        );

        cy.task('getPdfContent', `cypress/fixtures/downloads/${fileName}`).then((content) => {
          const cleanContent = ignoreAddedFormatting(content);

          expect(cleanContent).to.contain('Bob Smith');
          expect(cleanContent).to.contain('999 Letsby Avenue');
          expect(cleanContent).to.contain(
            'Does the information from the appellant accurately reflect the original planning application?',
          );
          expect(cleanContent).to.contain(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
          );
        });
      });
    });
  }
});
