/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/Commonpageobjects'
const commonObject = new CommonPageObjects();
module.exports = () => {
  commonObject.validatePageCaption().invoke('text')
  .then(text =>{
    expect(text).to.eq('About the appeal');
  })

}
