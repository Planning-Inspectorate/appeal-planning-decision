import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../../../common/householder-planning/appeals-service/standard-appeal';
import { provideCompleteAppeal } from '../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { doNotAgreeToTheDeclaration } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/doNotAgreeToTheDeclaration';
import { agreeToTheDeclaration } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { confirmAppealNotSubmitted } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealNotSubmitted';
import { confirmDeclarationAreRequired } from '../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmDeclarationAreRequired';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('an appeal is ready to be submitted', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToSubmissionPage);
});
When('the declaration is not agreed', () => {
 doNotAgreeToTheDeclaration();
});
When('the declaration is agreed', () => {
 cy.task('listenToQueue');
 agreeToTheDeclaration();
});

Then('the submission confirmation is presented', () => {
 confirmAppealSubmitted();

 /*cy.task('getLastFromQueue').then((document) => {
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
  });*/
});

Then('no submission confirmation is presented', () => {
 confirmAppealNotSubmitted();
 confirmDeclarationAreRequired();
});
