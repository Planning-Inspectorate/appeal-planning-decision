import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';

Given('an appeal is ready to be submitted', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToSubmissionPage();
});
When('the declaration is not agreed', () => {
  cy.doNotAgreeToTheDeclaration();
});
When('the declaration is agreed', () => {
  cy.task('listenToQueue');
  cy.agreeToTheDeclaration();
});

Then('the submission confirmation is presented', () => {
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((document) => {
    const applicationId = document.appeal.id;

    cy.request('http://localhost:3001/api/v1/' + applicationId).then((resp) => {
      expect(resp.status).to.eq(200);

      const documents = resp.body;
      let appealPdfDocument = null;
      documents.forEach((doc) => {
      if (doc.name.includes('Appeal-form.pdf')) {
          appealPdfDocument = doc;
        }
      });

      expect(appealPdfDocument).to.not.eq(null);
    });
  });
});

Then('no submission confirmation is presented', () => {
  cy.confirmAppealNotSubmitted();
  cy.confirmDeclarationAreRequired();
});
