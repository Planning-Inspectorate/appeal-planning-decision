import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getTask } from './task';
import { STANDARD_APPEAL,APPEAL_NOT_OWNER_OTHERS_INFORMED,
  APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED } from '../../common/householder-planning/standard-appeal';
import { provideCompleteAppeal } from '../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { confirmCheckYourAnswersPage } from '../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/confirmCheckYourAnswersPage';
import { confirmCheckYourAnswersDisplayItem } from '../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/confirmCheckYourAnswersDisplayItem';
import { confirmEligibleLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmEligibleLocalPlanningDepartment';
import { accessSection } from '../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/accessSection';
import { userIsNavigatedToPage } from '../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { clickSaveAndContinue } from '../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { provideDetailsName } from '../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsName';
import { provideDetailsEmail } from '../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsEmail';
import { provideApplicantName } from '../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideApplicantName';
import { provideAnswerNo } from '../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAnswerNo';
import { providePlanningApplicationNumber } from '../../../support/householder-planning/appeals-service/appellant-submission-planning-application-number/providePlanningApplicationNumber';
import { uploadPlanningApplicationFile } from '../../../support/householder-planning/appeals-service/appellant-submission-upload-application/uploadPlanningApplicationFile';
import { uploadDecisionLetterFile } from '../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/uploadDecisionLetterFile';
import { checkNoSensitiveInformation } from '../../../support/householder-planning/appeals-service/appeal-statement-submission/checkNoSensitiveInformation';
import { uploadAppealStatementFile } from '../../../support/householder-planning/appeals-service/appeal-statement-submission/uploadAppealStatementFile';
import { provideAddressLine1 } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideTownOrCity';
import { providePostcode } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/providePostcode';
import { provideCounty } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-address/provideCounty';
import { answerDoesNotOwnTheWholeAppeal } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerDoesNotOwnTheWholeAppeal';
import { answerHaveToldOtherOwnersAppeal } from '../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/answerHaveToldOtherOwnersAppeal';
import { answerCannotSeeTheWholeAppeal } from '../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCannotSeeTheWholeAppeal';
import { provideMoreDetails } from '../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/provideMoreDetails';
import { answerSiteHasIssues } from '../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasIssues';
import { provideSafetyIssuesConcerns } from '../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns';
import { uploadSupportingDocuments } from '../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/uploadSupportingDocuments';
import { goToAppealsPage } from '../../../support/householder-planning/appeals-service/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';

Given('the completed task list page is displayed', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
});

When('Check Your Answers is accessed', () => {
 clickCheckYourAnswers();
});

Then('the appeal information is presented', () => {
 confirmCheckYourAnswersPage();
 confirmCheckYourAnswersDisplayItem('[data-cy="who-are-you"]', 'Yes');
 confirmCheckYourAnswersDisplayItem('[data-cy="appellant-name"]', 'Valid Name');
 confirmCheckYourAnswersDisplayItem('[data-cy="appellant-email"]', 'valid@email.com');
 confirmCheckYourAnswersDisplayItem('[data-cy="application-number"]', 'ValidNumber/12345');
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-application"]',
    'appeal-statement-valid.doc',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-decision"]',
    'appeal-statement-valid.doc',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="appeal-statement"]',
    'appeal-statement-valid.doc',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="site-location"]',
    '1 Taylor Road\nClifton\nBristol\nSouth Glos\nBS8 1TG',
  );
 confirmCheckYourAnswersDisplayItem('[data-cy="site-ownership"]', 'Yes');
 confirmCheckYourAnswersDisplayItem('[data-cy="site-access"]', 'Yes');
 confirmCheckYourAnswersDisplayItem('[data-cy="site-access-safety"]', 'No');
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
 confirmEligibleLocalPlanningDepartment();
});

Given('the check your answers page is displayed for Person Appealing is Original Applicant', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
 clickCheckYourAnswers();
});

When('section {string} is accessed', (section) => {
  const { name } = getTask(section);
 accessSection(name);
});

Then('the {string} is displayed', (section) => {
  const { url } = getTask(section);
 userIsNavigatedToPage(url);
});

Given(
  'the check your answers page is displayed for Person Appealing is not Original Applicant',
  () => {
   provideCompleteAppeal(STANDARD_APPEAL);
   goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
  // cy.answerNoOriginalAppellant();
   provideAnswerNo();
   clickSaveAndContinue();
   provideDetailsName('Valid Name');
   provideDetailsEmail('valid@email.com');
   clickSaveAndContinue();
   provideApplicantName('Original Applicant');
   clickSaveAndContinue();
   clickCheckYourAnswers();
  },
);

Given('the user is presented with the answers they had provided', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
 clickCheckYourAnswers();
});

Given('changes are made for About you section', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
 //cy.answerNoOriginalAppellant();
  provideAnswerNo();
 clickSaveAndContinue();
 provideDetailsName('New Valid Name');
 provideDetailsEmail('new-valid@email.com');
 clickSaveAndContinue();
 provideApplicantName('New Original Applicant');
 clickSaveAndContinue();
});

When('Check Your Answers is presented', () => {
 clickCheckYourAnswers();
});

Then('the updated values for About you section are displayed', () => {
 confirmCheckYourAnswersDisplayItem('[data-cy="who-are-you"]', 'No');
 confirmCheckYourAnswersDisplayItem('[data-cy="appellant-name"]', 'New Valid Name');
 confirmCheckYourAnswersDisplayItem('[data-cy="appellant-email"]', 'new-valid@email.com');
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="appealing-on-behalf-of"]',
    'New Original Applicant',
  );
});

Given('changes are made for About the original planning application section', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
 providePlanningApplicationNumber('New ValidNumber/12345');
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
 uploadPlanningApplicationFile('appeal-statement-valid.jpeg');
 clickSaveAndContinue();
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
 uploadDecisionLetterFile('appeal-statement-valid.pdf');
 clickSaveAndContinue();
});

Then('the updated values for About the original planning application section are displayed', () => {
 confirmCheckYourAnswersDisplayItem('[data-cy="application-number"]', 'New ValidNumber/12345');
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-application"]',
    'appeal-statement-valid.jpeg',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-decision"]',
    'appeal-statement-valid.pdf',
  );
});

Given('changes are made for About your appeal section', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
 checkNoSensitiveInformation();
 uploadAppealStatementFile('appeal-statement-valid.png');
 clickSaveAndContinue();
 clickSaveAndContinue();
});

Then('the updated values for About your appeal section are displayed', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="appeal-statement"]',
    'appeal-statement-valid.png',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
});

Given('changes are made for Visiting the appeal site section', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
 goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
 provideAddressLine1('New 1 Taylor Road');
 provideAddressLine2('New Clifton');
 provideTownOrCity('New Bristol');
 provideCounty('New South Glos');
 providePostcode('XX8 1XX');
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
 answerDoesNotOwnTheWholeAppeal();
 clickSaveAndContinue();
 answerHaveToldOtherOwnersAppeal();
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
 answerCannotSeeTheWholeAppeal();
 provideMoreDetails('Some more new details.');
 clickSaveAndContinue();
  goToAppealsPage(pageURLAppeal.goToHealthAndSafetyPage);
 answerSiteHasIssues();
 provideSafetyIssuesConcerns('Beware of the dog!');
 clickSaveAndContinue();
});

Then('the updated values for Visiting the appeal site section are displayed', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="site-location"]',
    'New 1 Taylor Road\nNew Clifton\nNew Bristol\nNew South Glos\nXX8 1XX',
  );
 confirmCheckYourAnswersDisplayItem('[data-cy="site-ownership"]', 'No');
 confirmCheckYourAnswersDisplayItem('[data-cy="site-access"]', 'Some more new details.');
 confirmCheckYourAnswersDisplayItem('[data-cy="site-access-safety"]', 'Beware of the dog!');
});

Given('the appeal has more than one other documents', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
 uploadSupportingDocuments([
    'appeal-statement-valid.doc',
    'appeal-statement-valid.docx',
    'appeal-statement-valid.pdf',
  ]);
 clickSaveAndContinue();
});

Then('the multiple other documents are correctly displayed', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-count-heading"]',
    '3 files uploaded',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-0"]',
    'appeal-statement-valid.pdf',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-1"]',
    'appeal-statement-valid.docx',
  );
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-2"]',
    'appeal-statement-valid.doc',
  );
});

Given('the appeal has no other documents', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
});

Then('the absence of other document is correctly displayed', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
});

Given('an agent or appellant is reviewing their answers and they wholly own the site', () => {
 provideCompleteAppeal(STANDARD_APPEAL);
});

Given(
  'an agent or appellant is reviewing their answers and they do not wholly own the site',
  () => {
   provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  },
);

Given(
  'an agent or appellant has provided information where they have informed the other owners',
  () => {
   provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  },
);

Given(
  'an agent or appellant has provided information where they have not informed the other owners',
  () => {
   provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED);
  },
);

When(
  'agent or appellant decide to change their other owner notification answer from no to yes',
  () => {
   cy.get('[data-cy="other-owner-notification-change"]').click();
   cy.get('[data-cy="answer-yes"]').check();
   cy.get('[data-cy="button-save-and-continue"]').click();
    goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
  },
);

Then('the answer for other owner notification is displayed with a change link', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'Yes, I have already told the other owners',
  );
});

Then('the answer for other owner notification is not displayed', () => {
 cy.get('[data-cy="other-owner-notification"]').should('be.hidden');
});

Then('the positive answer for other owner notification is displayed with a change link', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'Yes, I have already told the other owners',
  );
});

Then('the negative answer for other owner notification is displayed with a change link', () => {
 confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'No, but I understand that I have to inform them',
  );
});
