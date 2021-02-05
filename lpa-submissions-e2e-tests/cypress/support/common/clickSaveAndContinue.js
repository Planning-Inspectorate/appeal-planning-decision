/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonObjects = new CommonPageObjects();
module.exports = () => {
  commonObjects.saveAndContinueButton().click();
};
