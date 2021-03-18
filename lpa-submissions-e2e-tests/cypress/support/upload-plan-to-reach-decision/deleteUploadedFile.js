/// <reference types = "Cypress"/>
import DeleteUploadedFile from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const deleteFile = new DeleteUploadedFile();
module.exports = (fileName) => {
  deleteFile.deleteFile().click(); //revisit to see how file delete page object will be identified
};
