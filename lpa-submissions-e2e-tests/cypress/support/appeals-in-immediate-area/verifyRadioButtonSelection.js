/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
 const appealsAreaRadioButtonSelection = new AppealsInImmediateArea();
 module.exports = (radioButtonValue) =>{
  if(radioButtonValue==='Yes'){
    appealsAreaRadioButtonSelection.areaAppealsRadioButtonYes().should('be.checked')
  }else{
    appealsAreaRadioButtonSelection.areaAppealsRadioButtonNo().should('be.checked');
  }
 }
