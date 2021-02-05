/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
 const inputAppealsRefernceNumber = new AppealsInImmediateArea();
 module.exports = () =>{
    inputAppealsRefernceNumber.appealReferenceNumberTextBox();
 }

