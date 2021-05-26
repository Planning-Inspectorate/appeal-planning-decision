import ignoreAddedFormatting from '../../support/common/ignoreAddedFormatting';

exports.downloadSubmissionPdf = () => {
  cy.getAppealReplyId().then((replyId) => {
    cy.request('GET', `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/${replyId}`).then(
      (response) => {
        const pdfId = response.body.submission.pdfStatement.uploadedFile.id;
        const fileName = `${replyId}.pdf`;

        cy.downloadFile(
          `${Cypress.env('DOCUMENT_SERVICE_BASE_URL')}/${replyId}/${pdfId}/file`,
          'cypress/fixtures/downloads',
          fileName,
        );

        cy.wrap(fileName).as('submissionPdf');
      },
    );
  });
};

exports.checkSubmissionPdfContent = (contentToFind) => {
  cy.get('@submissionPdf').then((fileName) => {
    cy.task('getPdfContent', `cypress/fixtures/downloads/${fileName}`).then((content) => {
      expect(ignoreAddedFormatting(content)).to.contain(contentToFind);
    });
  });
};
