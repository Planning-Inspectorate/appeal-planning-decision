import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
Given('I am listening to my queue', () => {
  cy.task('listenToQueue');
});

When('I put {string} on my queue', (message) => {
  cy.task('putOnQueue',message)
});

Then('I can read {string} from my queue', (expectedMessage) => {
  cy.task('getLastFromQueue').then( (actualMessage) => {
    expect(actualMessage).to.equal(expectedMessage)
  });

});
