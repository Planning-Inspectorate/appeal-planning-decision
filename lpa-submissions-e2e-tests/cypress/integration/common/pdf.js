Then('{string} is displayed on the PDF', () => {
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.get('@page').then(({ heading }) => {
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

            cy.task('getPdfContent', `cypress/fixtures/downloads/${fileName}`).then((content) => {
              const cleanContent = ignoreAddedFormatting(content);

              expect(cleanContent).to.contain(heading);
              expect(cleanContent).to.contain('yes');
            });
          },
        );
      });
    });
  }
});
