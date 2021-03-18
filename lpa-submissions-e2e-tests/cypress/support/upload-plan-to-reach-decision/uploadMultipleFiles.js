/// <reference types = "Cypress"/>
import ClickChooseFileButton from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const chooseFile = new ClickChooseFileButton();
module.exports = (fileName) => {
    chooseFile.clickChooseFileButton().attachFile([fileName]);
};
