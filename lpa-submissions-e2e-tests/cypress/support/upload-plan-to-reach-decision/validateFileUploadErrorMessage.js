/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects'
const error = new UploadThePlanToReachDecision();
module.exports = (errorMessage) => {
  if(errorMessage === 'Upload plans used to reach the decision'){
    error.fileNotUploadedSummaryErrorMessage().should('be.visible');
    error.fileNotUploadedErrorMessage().should('be.visible');
    error.fileNotUploadedErrorMessage() .invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.fileNotUploadedSummaryErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }
  else if(errorMessage === 'The file must be smaller than 15MB'){
    error.fileSizeInvalidSummaryErrorMessage().should('be.visible');
    error.fileSizeInvalidErrorMessage().should('be.visible');
    error.fileSizeInvalidSummaryErrorMessage() .invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.fileSizeInvalidErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }
  else if(errorMessage === 'The file must be DOC, DOCX, PDF, TIF, JPG or PNG'){
    error.fileFormatInvalidSummaryErrorMessage().should('be.visible');
    error.fileFormatInvalidErrorMessage().should('be.visible');
    error.fileFormatInvalidSummaryErrorMessage() .invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.fileFormatInvalidErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }
  else{
    error.fileNotUploadedSummaryErrorMessage().should('be.visible');
    error.fileNotUploadedErrorMessage().should('be.visible');
    error.fileNotUploadedSummaryErrorMessage() .invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
    error.fileNotUploadedErrorMessage().invoke('text')
    .then(text =>{
      expect(text).to.contain(errorMessage);
    })
  }
}
