/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const chooseFile = new UploadThePlanToReachDecision();
module.exports = (fileName) => {
    chooseFile.clickChooseFileButton().attachFile(fileName);
};
