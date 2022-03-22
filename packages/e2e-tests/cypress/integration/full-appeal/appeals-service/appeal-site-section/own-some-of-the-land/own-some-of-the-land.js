import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import {
  errorMessageOwnSomeLand,
  selectNo,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';

const url = 'full-appeal/submit-appeal/own-some-of-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = 'Do you own some of the land involved in the appeal? - Appeal a planning decision - GOV.UK';
const pageHeading = 'Do you own some of the land involved in the appeal?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';

Given("an appellant or agent is on the 'Do you own all the land involved in the appeal' page", () => {;
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
});
Then("'Do you own some of the land involved in the appeal' page is displayed", () => {
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText(textPageCaption);
});
Given("an appellant or agent is on the 'Do you own some of the land involved in the appeal' page", () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
})
When("the user select {string} and click 'Continue'", (option) => {
  selectRadioButton(option);
});
Then("the user is taken to the next page 'Do you know who owns the rest of the land involved in the appeal?'", () => {
  cy.url().should('contain', knowTheOwnersUrl);
})
Then("the user is taken to the next page 'Do you know who owns the land involved in the appeal'", () => {
  cy.url().should('contain', knowTheOwnersUrl);
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageOwnSomeLand, getErrorMessageSummary);
});
Then("they are presented with the 'Do you own all the land involved in the appeal' page", () => {
  cy.url().should('contain', ownAllOfLandUrl);
})

