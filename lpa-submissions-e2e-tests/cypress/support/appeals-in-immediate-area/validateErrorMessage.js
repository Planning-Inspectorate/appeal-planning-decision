/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
const error = new AppealsInImmediateArea();
module.exports = (errorMessage) => {
  if(errorMessage === 'Select yes if there are other appeals still being considered'){
    error.areaAppealsNoSelectionMadeSummaryErrorMessage().should('be.visible');
    error.areaAppealsNoSelectionMadeErrorMessage().should('be.visible');
    error.areaAppealsNoSelectionMadeSummaryErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.eq(errorMessage);
    })
    error.areaAppealsNoSelectionMadeErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.eq(errorMessage);
    })
  }else{
    error.areaAppealsAppealNumbersNotEnteredSummaryErrorMessage().should('be.visible');
    error.areaAppealsAppealNumbersNotEnteredErrorMessage().should('be.visible');
    error.areaAppealsAppealNumbersNotEnteredSummaryErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.eq(errorMessage);
    })
    error.areaAppealsAppealNumbersNotEnteredErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.eq(errorMessage);
    })
  }


}
