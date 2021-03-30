/// <reference types = "Cypress"/>
import {
  errorMessage as errorMessageObject,
  summaryErrorMessage as summaryErrorMessageObject,
} from '../../support/PageObjects/common-page-objects';

module.exports = (errorMessage, errorMessageObjectId, summaryErrorMessageObjectId) => {
  summaryErrorMessageObject(summaryErrorMessageObjectId).should('be.visible');
  errorMessageObject(errorMessageObjectId).should('be.visible');
  summaryErrorMessageObject(summaryErrorMessageObjectId)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  errorMessageObject(errorMessageObjectId)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
};
