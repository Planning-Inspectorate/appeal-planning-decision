import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('the appellant is on the start your appeal page', () => {
  cy.goToPageStartYourAppeal();
});

When('the appellant has selected to start the service', () => {
  cy.guidancePageNavigation('start');
});


Then('the appellant can begin an appeal', () => {
  cy.userIsNavigatedToPage('/eligibility/householder-planning-permission');
});
