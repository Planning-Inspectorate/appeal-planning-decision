import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';

Given('an appeal exists', () => {
  cy.goToSubmissionPage();
})

When('the appeal confirmation is presented', () => {
  cy.acceptTermsAndConditions();
})

Then('the required link is displayed in the page body', () => {
  cy.confirmFeedbackLinkIsDisplayedInPageBody();
})
