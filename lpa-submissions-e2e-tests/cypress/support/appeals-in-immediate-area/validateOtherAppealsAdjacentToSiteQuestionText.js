/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonObjects = new CommonPageObjects();
module.exports = () => {
commonObjects.validatePageLegendText().invoke('text')
  .then(text =>{
    expect(text).to.eq('Are there any other appeals adjacent or close to the site still being considered?');
  })
}
