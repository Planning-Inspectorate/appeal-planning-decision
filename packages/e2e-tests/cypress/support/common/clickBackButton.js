/// <reference types = "Cypress"/>
import { backButton } from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

module.exports = () => {
  backButton().click();
};
