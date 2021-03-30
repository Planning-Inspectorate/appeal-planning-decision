/// <reference types = "Cypress"/>
import { backButton } from '../PageObjects/common-page-objects';

module.exports = () => {
  backButton().click();
};
