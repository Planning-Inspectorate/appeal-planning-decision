/// <reference types = "Cypress"/>
import developmentPlanPageHeading from '../PageObjects/appeals-development-plan-pageobjects';
const pageHeading = new developmentPlanPageHeading();

module.exports = () =>{
  pageHeading.checkDevelopmentPlanPageHeading().invoke('text')
  .then(text =>{
    expect(text).to.contain('Development Plan Document or Neighbourhood Plan');
  })
}
