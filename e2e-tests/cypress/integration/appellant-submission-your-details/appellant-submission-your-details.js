import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user provides his name and his email', () => {
  cy.goToDetailsPage();
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail('good@email.com');
});

When('the user provides his name and his email with a bad format', () => {
  cy.goToDetailsPage();
  cy.provideDetailsName('b@d n@me');
  cy.provideDetailsEmail('bad@email.fr');
  cy.confirmDetailsWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

When('the user provides only his name', () => {
  cy.goToDetailsPage();
  cy.provideDetailsName('Good Name');
});

When('the user provides only his email', () => {
  cy.goToDetailsPage();
  cy.provideDetailsEmail('good@email.com');
});

Then('the user can proceed with the provided details', () => {
  cy.confirmDetailsWasAccepted();
});

Then('the user is informed that provided details have a bad format', () => {
  cy.confirmDetailsWasRejected([
    'Email should be a valid email address',
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  ]);
});

Then('the user is informed that the name is missing', () => {
  cy.confirmDetailsWasRejected('Enter your name');
});

Then('the user is informed that the email is missing', () => {
  cy.confirmDetailsWasRejected('Enter your email address');
});
