/// <reference types = "Cypress"/>
import FileDeleted from '../PageObjects/UploadThePlanToReachDecisionPageObjects'
const fileRemovedSuccess = new FileDeleted();
module.exports = (fileName) =>{
  fileRemovedSuccess.fileUploadSummaryList().should('be.visible')
  fileRemovedSuccess.fileUploadSummaryList().invoke('text')
  .then(text =>{
    expect(text).to.not.contain(fileName);
  })
}
