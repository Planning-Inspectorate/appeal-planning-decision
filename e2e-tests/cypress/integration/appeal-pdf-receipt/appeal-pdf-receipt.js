import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { APPEAL_NOT_OWNER_OTHERS_INFORMED } from '../common/standard-appeal';

Given('an agent or appellant has submitted an appeal and they do not wholly own the site', () => {
  cy.provideCompleteAppeal(APPEAL_NOT_OWNER_OTHERS_INFORMED);
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();
  cy.navigateToSubmissionInformationPage();
});

When('the pdf is viewed', () => {
  // Get the PDF when we have it available ... for now just test the html source
});

Then('the answer for other owner notification is displayed as submitted', () => {
  cy.confirmSubmissionInformationDisplayItems({
    'site-ownership': 'No',
    'other-owner-notification': 'Yes, I have already told the other owners',
  });
});
