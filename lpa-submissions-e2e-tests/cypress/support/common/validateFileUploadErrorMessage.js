/// <reference types = "Cypress"/>
import {
  summaryErrorMessage as summaryErrorMessageObject,
  summaryFileUploadErrorMessage,
} from '../../support/PageObjects/common-page-objects';

module.exports = (errorMessage, errorMessageObjectId) => {
  summaryFileUploadErrorMessage().should('be.visible');
  cy.title().should('match', /^Error: /);
  cy.checkPageA11y();

  summaryFileUploadErrorMessage()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });

  if (errorMessageObjectId) {
    const errorMessageObject = cy.get(errorMessageObjectId);

    errorMessageObject.should('be.visible');
    errorMessageObject.invoke('text').then((text) => {
      expect(text).to.contain(errorMessage);
    });
  }
  cy.clickSaveAndContinue();
};
