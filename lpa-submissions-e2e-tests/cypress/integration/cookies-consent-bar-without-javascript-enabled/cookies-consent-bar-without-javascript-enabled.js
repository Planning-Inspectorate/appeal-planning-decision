import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getSubTaskInfo } from '../../support/common/subTasks';

const disableJs = true;

Given('a user visits the site with JavaScript disabled', () => {
  cy.goToPage('task-list', undefined, disableJs);
});

When('the user navigates through the service', () => {
  const { id, url } = getSubTaskInfo("Accuracy Appellant Submission");

  cy.clickOnSubTaskLink(id);
  cy.verifyPage(url);
});

When('the user views the cookie preferences page', () => {
  cy.viewCookiePageUsingCookieConsentBannerLink();
});

Then('the cookies page is presented', () => {
  cy.visit('/cookies', { script: false });
});
