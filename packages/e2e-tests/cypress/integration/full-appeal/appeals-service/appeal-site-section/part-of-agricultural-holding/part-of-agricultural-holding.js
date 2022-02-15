import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  errorMessageAgriculturalHolding, hintTextAgriculturalHolding, selectNo, selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
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
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';

const url = 'full-appeal/submit-appeal/agricultural-holding';
const areYouATenantUrl = '/full-appeal/submit-appeal/are-you-a-tenant';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const textPageCaption = 'Tell us about the appeal site';
const pageTitleAgriculturalHolding = 'Is the appeal site part of an agricultural holding? - Appeal a planning decision - GOV.UK';
const pageHeadingAgriculturalHolding = 'Is the appeal site part of an agricultural holding?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const hintText = 'An agricultural holding is land that has an agricultural tenant.';

Given("an appellant or agent is on the 'Do you own all of the land involved in the appeal' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
})
When("the user select {string} and click 'Continue'", (option) => {
  selectRadioButton(option);
});
Then("'Is the appeal site part of an agricultural holding' page is displayed with some guidance text", () => {
  cy.url().should('contain', url);
  });
Given("an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
  verifyPageHeading(pageHeadingAgriculturalHolding);
  verifyPageTitle(pageTitleAgriculturalHolding)
  pageCaptionText().should('contain', textPageCaption);
  hintTextAgriculturalHolding().should('contain', hintText);
  })
Then("the user is taken to the next page 'Are you a tenant of the agricultural holding'", ()=>{
  cy.url().should('contain', areYouATenantUrl);
})
Then("are taken to the next page 'Is the site visible from a public road'", () => {
  cy.url().should('contain', visibleFromRoadUrl);
})
Then('they are presented with an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageAgriculturalHolding, getErrorMessageSummary);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Do you own all of the land involved in the appeal' page", () => {
  cy.url().should('contain', ownAllOfLandUrl);
});
