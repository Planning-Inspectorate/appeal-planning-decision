/// <reference types = "Cypress"/>
import { saveAndContinueButton } from '../PageObjects/common-page-objects';

module.exports = () => {
  saveAndContinueButton().click();
};
