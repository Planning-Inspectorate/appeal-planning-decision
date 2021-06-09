/// <reference types = "Cypress"/>
import { summaryErrorMessage as summaryErrorMessageObject } from '../../support/PageObjects/common-page-objects';

module.exports = (errorMessage, errorMessageObjectId, summaryErrorMessageObjectId) => {
  summaryErrorMessageObject(summaryErrorMessageObjectId).should('be.visible');
  cy.title().should('match', '/^Error: /');
  summaryErrorMessageObject(summaryErrorMessageObjectId)
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
};
