import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getTask } from './task';
import {
  STANDARD_APPEAL,
  APPEAL_NOT_OWNER_OTHERS_INFORMED,
  APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED,
} from './standard-appeal';

Given('the completed task list page is displayed', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
});

When('Check Your Answers is accessed', () => {
  cy.clickCheckYourAnswers();
});

Then('the appeal information is presented', () => {
  cy.confirmCheckYourAnswersPage();
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="who-are-you"]', 'Yes');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="appellant-name"]', 'Valid Name');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="appellant-email"]', 'valid@email.com');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="application-number"]', 'ValidNumber/12345');
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-application"]',
    'appeal-statement-valid.doc',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-decision"]',
    'appeal-statement-valid.doc',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="appeal-statement"]',
    'appeal-statement-valid.doc',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="site-location"]',
    '1 Taylor Road\nClifton\nBristol\nSouth Glos\nBS8 1TG',
  );
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-ownership"]', 'Yes');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-access"]', 'Yes');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-access-safety"]', 'No');
  cy.goToPlanningDepartmentPage();
  cy.confirmEligibleLocalPlanningDepartment();
});

Given('the check your answers page is displayed for Person Appealing is Original Applicant', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.clickCheckYourAnswers();
});

When('section {string} is accessed', (section) => {
  const { name } = getTask(section);
  cy.accessSection(name);
});

Then('the {string} is displayed', (section) => {
  const { url } = getTask(section);
  cy.userIsNavigatedToPage(url);
});

Given(
  'the check your answers page is displayed for Person Appealing is not Original Applicant',
  () => {
    cy.provideCompleteAppeal(STANDARD_APPEAL);
    cy.goToWhoAreYouPage();
    cy.answerNoOriginalAppellant();
    cy.clickSaveAndContinue();
    cy.provideDetailsName('Valid Name');
    cy.provideDetailsEmail('valid@email.com');
    cy.clickSaveAndContinue();
    cy.provideApplicantName('Original Applicant');
    cy.clickSaveAndContinue();
    cy.clickCheckYourAnswers();
  },
);

Given('the user is presented with the answers they had provided', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.clickCheckYourAnswers();
});

Given('changes are made for About you section', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToWhoAreYouPage();
  cy.answerNoOriginalAppellant();
  cy.clickSaveAndContinue();
  cy.provideDetailsName('New Valid Name');
  cy.provideDetailsEmail('new-valid@email.com');
  cy.clickSaveAndContinue();
  cy.provideApplicantName('New Original Applicant');
  cy.clickSaveAndContinue();
});

When('Check Your Answers is presented', () => {
  cy.clickCheckYourAnswers();
});

Then('the updated values for About you section are displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="who-are-you"]', 'No');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="appellant-name"]', 'New Valid Name');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="appellant-email"]', 'new-valid@email.com');
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="appealing-on-behalf-of"]',
    'New Original Applicant',
  );
});

Given('changes are made for About the original planning application section', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToPlanningApplicationNumberPage();
  cy.providePlanningApplicationNumber('New ValidNumber/12345');
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile('appeal-statement-valid.jpeg');
  cy.clickSaveAndContinue();
  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile('appeal-statement-valid.pdf');
  cy.clickSaveAndContinue();
});

Then('the updated values for About the original planning application section are displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="application-number"]', 'New ValidNumber/12345');
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-application"]',
    'appeal-statement-valid.jpeg',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="upload-decision"]',
    'appeal-statement-valid.pdf',
  );
});

Given('changes are made for About your appeal section', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile('appeal-statement-valid.png');
  cy.clickSaveAndContinue();
  cy.clickSaveAndContinue();
});

Then('the updated values for About your appeal section are displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="appeal-statement"]',
    'appeal-statement-valid.png',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
});

Given('changes are made for Visiting the appeal site section', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToSiteAddressPage();
  cy.provideAddressLine1('New 1 Taylor Road');
  cy.provideAddressLine2('New Clifton');
  cy.provideTownOrCity('New Bristol');
  cy.provideCounty('New South Glos');
  cy.providePostcode('XX8 1XX');
  cy.clickSaveAndContinue();
  cy.goToWholeSiteOwnerPage();
  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.answerHaveToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
  cy.goToAccessSitePage();
  cy.answerCannotSeeTheWholeAppeal();
  cy.provideMoreDetails('Some more new details.');
  cy.clickSaveAndContinue();
  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasIssues();
  cy.provideSafetyIssues('Beware of the dog!');
  cy.clickSaveAndContinue();
});

Then('the updated values for Visiting the appeal site section are displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="site-location"]',
    'New 1 Taylor Road\nNew Clifton\nNew Bristol\nNew South Glos\nXX8 1XX',
  );
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-ownership"]', 'No');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-access"]', 'Some more new details.');
  cy.confirmCheckYourAnswersDisplayItem('[data-cy="site-access-safety"]', 'Beware of the dog!');
});

Given('the appeal has more than one other documents', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
  cy.goToSupportingDocumentsPage();
  cy.uploadSupportingDocuments([
    'appeal-statement-valid.doc',
    'appeal-statement-valid.docx',
    'appeal-statement-valid.pdf',
  ]);
  cy.clickSaveAndContinue();
});

Then('the multiple other documents are correctly displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-count-heading"]',
    '3 files uploaded',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-0"]',
    'appeal-statement-valid.pdf',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-1"]',
    'appeal-statement-valid.docx',
  );
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-uploaded-file-2"]',
    'appeal-statement-valid.doc',
  );
});

Given('the appeal has no other documents', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
});

Then('the absence of other document is correctly displayed', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="supporting-documents-no-files"]',
    'No files uploaded',
  );
});

Given('an agent or appellant is reviewing their answers and they wholly own the site', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
});

Given(
  'an agent or appellant is reviewing their answers and they do not wholly own the site',
  () => {
    cy.provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  },
);

Given(
  'an agent or appellant has provided information where they have informed the other owners',
  () => {
    cy.provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  },
);

Given(
  'an agent or appellant has provided information where they have not informed the other owners',
  () => {
    cy.provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_NOT_INFORMED);
  },
);

When(
  'agent or appellant decide to change their other owner notification answer from no to yes',
  () => {
    cy.get('[data-cy="other-owner-notification-change"]').click();
    cy.get('[data-cy="answer-yes"]').check();
    cy.get('[data-cy="button-save-and-continue"]').click();
    cy.goToCheckYourAnswersPage();
  },
);

Then('the answer for other owner notification is displayed with a change link', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'Yes, I have already told the other owners',
  );
});

Then('the answer for other owner notification is not displayed', () => {
  cy.get('[data-cy="other-owner-notification"]').should('be.hidden');
});

Then('the positive answer for other owner notification is displayed with a change link', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'Yes, I have already told the other owners',
  );
});

Then('the negative answer for other owner notification is displayed with a change link', () => {
  cy.confirmCheckYourAnswersDisplayItem(
    '[data-cy="other-owner-notification"]',
    'No, but I understand that I have to inform them',
  );
});
