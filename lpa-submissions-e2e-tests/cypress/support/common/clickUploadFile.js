/// <reference types = "Cypress"/>
import ClickUploadFileButton from '../PageObjects/CommonPageObjects';
const uploadFile = new ClickUploadFileButton();
module.exports = () => {
  uploadFile.clickUploadFileButton();
};
