import { Then } from 'cypress-cucumber-preprocessor/steps';
import '../cookie-consent-save-preferences/cookie-consent-save-preferences';
import { confirmFlashMessageExists } from '../../../../support/householder-planning/appeals-service/flash-message/confirmFlashMessageExists';
import { confirmFlashMessageContainerDoesNotExist } from '../../../../support/householder-planning/appeals-service/flash-message/confirmFlashMessageContainerDoesNotExist';

Then('the user sees a one time message to denote action success', () => {
  confirmFlashMessageExists('flash-message-success-1');
  cy.reload();
  confirmFlashMessageContainerDoesNotExist();
});
