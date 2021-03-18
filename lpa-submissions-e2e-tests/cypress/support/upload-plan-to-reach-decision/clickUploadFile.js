/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const uploadFile = new UploadThePlanToReachDecision();
module.exports = () => {
  uploadFile.clickUploadFileButton();
};
