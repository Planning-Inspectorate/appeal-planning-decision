import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
Given('i am listening to my queue', () => {
  cy.task('listenToQueue');
});

When('i put {string} on my queue', (message) => {
  cy.task('putOnQueue',message)
});

Then('i can read {string} from my queue', (expectedMessage) => {
  cy.task('getLastFromQueue').then( (actualMessage) => {
    expect(actualMessage).to.equal(expectedMessage)
  });

});
