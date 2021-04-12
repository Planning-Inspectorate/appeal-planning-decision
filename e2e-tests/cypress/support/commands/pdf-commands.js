Cypress.Commands.add('getPDF', () => {
  cy.task('getLastFromQueue').then((document) => {
    const applicationId = document.appeal.id;

    cy.request('http://localhost:3001/api/v1/' + applicationId).then((resp) => {
      expect(resp.status).to.eq(200);

      const documents = resp.body;
      let appealPdfDocument = null;
      documents.forEach((doc) => {
        if (doc.name === 'Appeal-form.pdf') {
          appealPdfDocument = doc;
        }
      });

      return appealPdfDocument;
    });
  });
});
