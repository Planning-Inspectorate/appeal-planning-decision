/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonPageObjects = new CommonPageObjects();
module.exports = (errorMessage) => {
  switch (errorMessage) {
    case 'The file must be smaller than 15MB':
      errorProcess(
        commonPageObjects.fileSizeInvalidSummaryErrorMessage,
        commonPageObjects.fileSizeInvalidErrorMessage,
      );
      break;
    case 'The file must be DOC, DOCX, PDF, TIF, JPG or PNG':
      errorProcess(
        commonPageObjects.fileFormatInvalidSummaryErrorMessage,
        commonPageObjects.fileFormatInvalidErrorMessage,
      );
      break;
    default:
      errorProcess(
        commonPageObjects.fileNotUploadedSummaryErrorMessage,
        commonPageObjects.fileNotUploadedErrorMessage,
      );
  }
};

const errorProcess = (summaryErrorMessage, errorMessage) => {
  summaryErrorMessage.should('be.visible');
  errorMessage.should('be.visible');
  summaryErrorMessage.invoke('text').then((text) => {
    expect(text).to.contain(errorMessage);
  });
  errorMessage.invoke('text').then((text) => {
    expect(text).to.contain(errorMessage);
  });
};
