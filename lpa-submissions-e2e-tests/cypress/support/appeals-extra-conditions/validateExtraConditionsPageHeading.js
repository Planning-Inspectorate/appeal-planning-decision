/// <reference types = "Cypress"/>
import extraConditionsPageHeading from '../PageObjects/AppealsExtraConditionsPageObjects';
const pageHeading = new extraConditionsPageHeading();

module.exports = () =>{
  pageHeading.checkExtraConditionsPageHeading.invoke('text')
  .then(text =>{
    expect(text).to.contain('Do you have any extra conditions?');
  })
}
