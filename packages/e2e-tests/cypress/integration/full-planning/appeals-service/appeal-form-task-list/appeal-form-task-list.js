import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const pageHeading = 'Appeal a planning decision';
const url = '/appellant-submission/task-list';
const pageTitle = 'Task list - Appeal a planning decision - Appeal a planning decision - GOV.UK';

Given('Appellant has been successful on their eligibility',()=> {
 cy.visit('http://localhost:9003/before-you-appeal');
})
When("they are on the 'Appeal a Planning Decision' page",()=> {

})
Then('they are presented with the list of tasks that they are required to complete in order to submit their appeal',()=> {
})
Then('when a section has been completed they are able to see what has been completed or incompleted',()=> {

})

