/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects'
const fileUploadSuccess = new UploadThePlanToReachDecision();
module.exports = (fileName) =>{
  fileUploadSuccess.fileUploadSummaryList().should('be.visible')
  fileUploadSuccess.fileUploadSummaryList().invoke('text')
  .then(text =>{
    expect(text).to.contain(fileName);
  })
}
