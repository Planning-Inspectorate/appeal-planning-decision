/// <reference types = "Cypress"/>
import DevelopmentPlanPage from '../PageObjects/appeals-development-plan-pageobjects';
const error = new DevelopmentPlanPage();
module.exports = (errorMessage) => {
  if (errorMessage === 'Select yes if there is a relevant Development Plan or Neighbourhood Plan') {
    error.developmentPlanNoSelectionMadeSummaryErrorMessage().should('be.visible');
    error.developmentPlanNoSelectionMadeErrorMessage().should('be.visible');
    error
      .developmentPlanNoSelectionMadeSummaryErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
    error
      .developmentPlanNoSelectionMadeErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
  } else if (errorMessage === 'Enter the relevant information about the plan and this appeal'){
    error.relevantInformationNotEnteredSummaryErrorMessage().should('be.visible');
    error.relevantInformationNotEnteredErrorMessage().should('be.visible');
    error
      .relevantInformationNotEnteredSummaryErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
    error
      .relevantInformationNotEnteredErrorMessage()
      .invoke('text')
      .then((text) => {
        expect(text).to.contain(errorMessage);
      });
  }
};
