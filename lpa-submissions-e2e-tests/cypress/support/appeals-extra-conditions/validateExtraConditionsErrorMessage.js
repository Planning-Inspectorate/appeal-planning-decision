/// <reference types = "Cypress"/>
import ExtraConditionsPage from '../PageObjects/AppealsExtraConditionsPageObjects';
const error = new ExtraConditionsPage();
module.exports = (errorMessage) => {
  if (errorMessage === 'Select yes if you have extra conditions') {
    error.extraConditionsNoSelectionMadeSummaryErrorMessage().should('be.visible');
    error.extraConditionsNoSelectionMadeErrorMessage().should('be.visible');
    error
      .extraConditionsNoSelectionMadeSummaryErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
    error
      .extraConditionsNoSelectionMadeErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
  } else if (errorMessage === 'What are the extra conditions?'){
    error.extraConditionsNotEnteredSummaryErrorMessage().should('be.visible');
    error.extraConditionsNotEnteredErrorMessage().should('be.visible');
    error
      .extraConditionsNotEnteredSummaryErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
    error
      .extraConditionsNotEnteredErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
  }
};
