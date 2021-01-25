import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the lpa tasks are presented',()=>{
    cy.visitTaskListQuestionnaireSubmissionPage();

});
Given('And the task {string} is available for selection',()=>{

});
