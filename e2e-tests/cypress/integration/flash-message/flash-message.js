import { Then } from 'cypress-cucumber-preprocessor/steps';
import '../cookie-consent-save-preferences/cookie-consent-save-preferences';

Then('the user sees a one time message to denote action success', () => {
  cy.confirmFlashMessageExists('flash-message-success-1');
  cy.reload();
  cy.confirmFlashMessageContainerDoesNotExist();
});
