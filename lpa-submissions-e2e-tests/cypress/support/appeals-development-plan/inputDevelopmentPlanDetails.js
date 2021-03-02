/// <reference types = "Cypress"/>
import DevelopmentPlanPage from '../PageObjects/appeals-development-plan-pageobjects'
 const developmentPlanDetails = new DevelopmentPlanPage();
 module.exports = () =>{
  developmentPlanDetails.developmentPlanDetailsTextBox();
 }

