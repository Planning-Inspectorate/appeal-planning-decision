/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects';
const inputAppealsReferenceNumber = new AppealsInImmediateArea();
module.exports = () => {
  inputAppealsReferenceNumber.appealReferenceNumberTextBox();
};
