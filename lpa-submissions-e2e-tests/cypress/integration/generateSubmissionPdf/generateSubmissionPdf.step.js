import { Then } from 'cypress-cucumber-preprocessor/steps';

const ignoringAddedFormatting = (content) => {
  return content.replace(/\n/g,' ');
}

Then('a PDF of the Check Your Answers page is created', () => {
  cy.verifyPage('information-submitted');


  cy.get('@appeal').then((appeal) => { // need the appeal so we know what values to assert against
    cy.get('@appealReply').then((reply) => { // need the reply so we can do a lookup;
                                             //  bit circular here but the @appealReply we are holding at this point is the things we loaded in the first place
                                             // the GET to the appeal reply service is basically doing a 'refresh' to pick up the data that has subsequently been added - ie. the file that we uploaded.
      cy.request(
        'GET',
        `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/${reply.appealId}`,
      ).then((response) => {
        const pdfId = response.body.reply.submission.pdfStatement.uploadedFile.id;

        // use exiting cypress download functionality to download the file so we can interogate it
        cy.downloadFile(
          `${Cypress.env('DOCUMENT_SERVICE_BASE_URL')}/${reply.id}/${pdfId}/file`,
          'cypress/fixtures/Download',
          `${reply.id}.pdf`
        );

        // use our task to read the pdf + present the content for asserting against
        cy.task('getPdfContent', `cypress/fixtures/Download/${reply.id}.pdf`).then(content => {

          expect(content).to.contain(appeal.aboutYouSection.yourDetails.name);

          const {siteAddress} = appeal.appealSiteSection;
          expect(content).to.contain(`${siteAddress.addressLine1}, ${siteAddress.addressLine2}, ${siteAddress.town}, ${siteAddress.county}, ${siteAddress.postcode}`);

          expect(content).to.contain(
            'Does the information from the appellant accurately reflect the original planning application?',
          );
          expect(ignoringAddedFormatting(content)).to.contain(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
          );
        });
      });

    });

  });

});
