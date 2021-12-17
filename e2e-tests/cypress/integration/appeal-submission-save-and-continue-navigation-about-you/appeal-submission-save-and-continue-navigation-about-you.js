import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the "Who are you" is presented', () => {
  cy.goToWhoAreYouPage();
});

Given('the "Your details" is presented for an original applicant', () => {
  cy.goToYourDetailsPage();
  cy.provideAreYouOriginalApplicant('are');
  cy.clickSaveAndContinue();
});

Given('the "Your details" is presented for not the original applicant', () => {
  cy.goToYourDetailsPage();
  cy.provideAreYouOriginalApplicant('are not');
  cy.clickSaveAndContinue();
});

Given('the "Applicant name" is presented', () => {
  cy.provideAreYouOriginalApplicant('are');
  cy.goToApplicantNamePage();
});

When('the "Who are you" is submitted with valid values', () => {
  cy.provideAreYouOriginalApplicant('are');
  cy.clickSaveAndContinue();
});

When('the "Your details" is submitted with valid values', () => {
  cy.provideDetailsName('Timmy Tester');
  cy.provideDetailsEmail('timmy@example.com');
  cy.clickSaveAndContinue();
});

When('the "Applicant name" is submitted with valid values', () => {
  cy.provideNameOfOriginalApplicant('Timmy Tester');
  cy.clickSaveAndContinue();
});
