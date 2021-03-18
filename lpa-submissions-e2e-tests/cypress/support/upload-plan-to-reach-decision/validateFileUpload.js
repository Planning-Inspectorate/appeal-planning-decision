/// <reference types = "Cypress"/>
import FileUpload from '../PageObjects/UploadThePlanToReachDecisionPageObjects'
const fileUploadSuccess = new FileUpload();
module.exports = (fileName) =>{
  fileUploadSuccess.fileUploadSummaryList().should('be.visible')
  fileUploadSuccess.fileUploadSummaryList().invoke('text')
  .then(text =>{
    expect(text).to.contain(fileName);
  })
}
