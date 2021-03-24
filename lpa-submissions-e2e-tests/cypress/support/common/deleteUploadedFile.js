/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonPageObjects = new CommonPageObjects();
module.exports = (fileName) => {
  commonPageObjects.deleteFile().click(); //revisit to see how file delete page object will be identified
};
