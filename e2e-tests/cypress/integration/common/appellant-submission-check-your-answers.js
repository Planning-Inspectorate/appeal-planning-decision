import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';

Given('the completed task list page is displayed', () => {
  cy.goToTaskListPage();
});

When('Check Your Answers is accessed', () => {
  cy.goToCheckYourAnswersPage();
});

Then('the appeal information is presented', () => {

});

Given('the check your answers page is displayed for Person Appealing is Original Applicant', () => {

});

When('section {string} is accessed', (section) => {

});

Then('the {string} is displayed', (section) => {

});

Given('the check your answers page is displayed for Person Appealing is not Original Applicant', () => {

});

Given('changes are made for About you section', () => {

});

When('Check Your Answers is presented', () => {

});

Then('the updated values for About you section are displayed', () => {

});

Given('changes are made for About the original planning application section', () => {

});

Then('the updated values for About the original planning application section are displayed', () => {

});

Given('changes are made for About your appeal section', () => {

});

Then('the updated values for About your appeal section are displayed', () => {

});

Given('changes are made for Visiting the appeal site section', () => {

});

Then('the updated values for Visiting the appeal site section are displayed', () => {

});

Given('the appeal has more than one other documents', () => {

});

Then('the multiple other documents are correctly displayed', () => {

});

Given('the appeal has no other documents', () => {

});

Then('the absence of other document is correctly displayed', () => {

});
