/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonPageObjects = new CommonPageObjects();
module.exports = (fileName) =>{
  commonPageObjects.fileUploadSummaryList().should('be.visible')
  commonPageObjects.fileUploadSummaryList().invoke('text')
  .then(text =>{
    expect(text).to.not.contain(fileName);
  })
}
