/// <reference types = "Cypress"/>
import { saveAndContinueButton } from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

module.exports = () => {
  saveAndContinueButton().click();
};
