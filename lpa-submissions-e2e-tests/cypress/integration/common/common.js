import { When } from 'cypress-cucumber-preprocessor/steps';

When('Back is then requested', () => {
  cy.clickBackButton();
});
