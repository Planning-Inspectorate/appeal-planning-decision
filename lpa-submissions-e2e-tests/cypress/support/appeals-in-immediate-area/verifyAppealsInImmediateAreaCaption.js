/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects'
const commonObject = new CommonPageObjects();
module.exports = () => {
  commonObject.validatePageCaption().invoke('text')
  .then(text =>{
    expect(text).to.contain('About the appeal');
  })

}
