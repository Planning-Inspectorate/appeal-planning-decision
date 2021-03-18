/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const deleteFile = new UploadThePlanToReachDecision();
module.exports = (fileName) => {
  deleteFile.deleteFile().click(); //revisit to see how file delete page object will be identified
};
