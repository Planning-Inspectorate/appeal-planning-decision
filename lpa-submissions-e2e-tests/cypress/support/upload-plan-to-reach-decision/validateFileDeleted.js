/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects'
const fileRemovedSuccess = new UploadThePlanToReachDecision();
module.exports = (fileName) =>{
  fileRemovedSuccess.fileUploadSummaryList().should('be.visible')
  fileRemovedSuccess.fileUploadSummaryList().invoke('text')
  .then(text =>{
    expect(text).to.not.contain(fileName);
  })
}
