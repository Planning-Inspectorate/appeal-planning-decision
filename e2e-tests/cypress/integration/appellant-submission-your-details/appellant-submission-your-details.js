import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user provides their valid {string} and {string}', (name, email) => {
  cy.goToDetailsPage();
  cy.provideDetailsName(name);
  cy.provideDetailsEmail(email);
});

When('the user provides the name {string}', (name) => {
  cy.goToDetailsPage();
  cy.provideDetailsName(name);
  cy.provideDetailsEmail('good@email.com');
});

When('the user provides the email {string}', (email) => {
  cy.goToDetailsPage();
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail(email);
});

When('the user provides only a name', () => {
  cy.goToDetailsPage();
  cy.provideDetailsName('Good Name');
});

When('the user provides only an email', () => {
  cy.goToDetailsPage();
  cy.provideDetailsEmail('good@email.com');
});

Then("the appeal's Your Details task is completed with {string} and {string}", (name, email) => {
  cy.confirmDetailsWasAccepted(name, email);
});

Then('the user is informed that the provided name is invalid', () => {
  cy.confirmDetailsWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then('the user is informed that the provided email is invalid', () => {
  cy.confirmDetailsWasRejected('Email should be a valid email address');
});

Then('the user is informed that the name is missing', () => {
  cy.confirmDetailsWasRejected('Enter your name');
});

Then('the user is informed that the email is missing', () => {
  cy.confirmDetailsWasRejected('Enter your email address');
});

Then(
  'the user can see that their appeal has been updated with {string} and {string}',
  (name, email) => {
    cy.confirmNameValue(name);
    cy.confirmEmailValue(email);
  },
);

Then('the user can see that their appeal has not been updated with {string}', (notUpdated) => {
  if (notUpdated.includes('name')) {
    cy.confirmNameValue('');
  }

  if (notUpdated.includes('email')) {
    cy.confirmEmailValue('');
  }
});
