/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
const error = new AppealsInImmediateArea();
module.exports = (errorMessage) => {
  if(errorMessage === 'Select yes if there are other appeals still being considered'){
    error.otherAppealsNoSelectionMadeSummaryErrorMessage().should('be.visible');
    error.otherAppealsNoSelectionMadeErrorMessage().should('be.visible');
    error.otherAppealsNoSelectionMadeSummaryErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.otherAppealsNoSelectionMadeErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }else{
    error.otherAppealsAppealNumbersNotEnteredSummaryErrorMessage().should('be.visible');
    error.otherAppealsAppealNumbersNotEnteredErrorMessage().should('be.visible');
    error.otherAppealsAppealNumbersNotEnteredSummaryErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.otherAppealsAppealNumbersNotEnteredErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }
}
