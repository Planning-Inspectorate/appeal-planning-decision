/// <reference types = "Cypress"/>
import ExtraConditionsPage from '../PageObjects/appeals-extra-conditions-pageobjects';
const extraConditionsRadioButtonSelection = new ExtraConditionsPage();
module.exports = (radioButtonValue) => {
  if (radioButtonValue === 'Yes') {
    extraConditionsRadioButtonSelection.extraConditionsRadioButtonYes();
  } else {
    extraConditionsRadioButtonSelection.extraConditionsRadioButtonNo();
  }
};
