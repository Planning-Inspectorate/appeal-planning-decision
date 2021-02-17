/// <reference types = "Cypress"/>
import ExtraConditionsPage from '../PageObjects/appeals-extra-conditions-pageobjects'
 const extraConditionsExtraInformation = new ExtraConditionsPage();
 module.exports = () =>{
  extraConditionsExtraInformation.extraConditionsExtraInformationTextBox();
 }

