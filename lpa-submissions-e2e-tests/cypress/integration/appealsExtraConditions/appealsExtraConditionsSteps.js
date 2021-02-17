import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';


Given(`The Householder planning appeal questionnaire page is presented`,()=>{
  cy.goToAppealsQuestionnaireTasklistPage();
});

When(`the user selects the link 'Do you have any extra conditions?'`,()=>{
  cy.goToExtraConditionsPage();
  cy.verifyNotStartedStatus('extraConditions');
});

Then(`the user is presented with the 'Do you have any extra conditions?' page`,()=>{
  cy.validateExtraConditionsPageHeading();
});

Then(`the Page title is 'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'`,()=>{
  cy.validateExtraConditionsPageTitle();
});

