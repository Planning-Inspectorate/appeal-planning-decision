/// <reference types = "Cypress"/>
import DevelopmentPlanPage from '../PageObjects/appeals-development-plan-pageobjects';
const developmentPlanRadioButtonSelection = new DevelopmentPlanPage();
module.exports = (radioButtonValue) => {
  if (radioButtonValue === 'yes') {
    developmentPlanRadioButtonSelection.developmentPlanRadioButtonYes();
  } else {
    developmentPlanRadioButtonSelection.developmentPlanRadioButtonNo();
  }
};
