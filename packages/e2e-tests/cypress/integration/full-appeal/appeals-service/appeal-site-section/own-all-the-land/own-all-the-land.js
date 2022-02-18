import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { getBackLink, getErrorMessageSummary } from '../../../../../support/common-page-objects/common-po';
import {
  aboutAppealSiteSectionLink, pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import {
  errorMessageOwnAllLand,
  selectNo,
  selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';

import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';

const url = 'full-appeal/submit-appeal/own-all-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = "Do you own all the land involved in the appeal? - Appeal a planning decision - GOV.UK";
const pageHeading = 'Do you own all the land involved in the appeal?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';

When("they select the 'Continue' button",()=> {
    getSaveAndContinueButton().click();
});
Given("an appellant or agent is on the 'What is the address of the appeal site' page",()=> {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
});
Then("'Do you own all the land involved in the appeal' is displayed",()=> {
  cy.url().should('contain', url);
});
Then("the user is taken to the next page 'Is the appeal site part of an agricultural holding'",()=> {
  cy.url().should('contain', agriculturalHoldingUrl);
});
When("no selection is made and they click Continue", () => {
  getSaveAndContinueButton().click();
})
Given("an appellant or agent is on the 'Do you own all the land involved in the appeal' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain',url);
  cy.checkPageA11y();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText().should('contain', textPageCaption);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'What is the address of the appeal site' page", () => {
  cy.url().should('contain', siteAddressUrl);
});
Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageOwnAllLand, getErrorMessageSummary);
});
Then("they are taken to the next page 'Do you own some of the land involved in the appeal'", () => {
  cy.url().should('contain', ownSomeOfLandUrl);
})
When("the user select {string} and click 'Continue'", (option) => {
  selectRadioButton(option);
});
