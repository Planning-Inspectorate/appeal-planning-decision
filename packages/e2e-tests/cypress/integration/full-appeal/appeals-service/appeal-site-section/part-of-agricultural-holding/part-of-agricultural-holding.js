import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  advertisingYourAppealToldAboutAppeal,
  advertisingYourAppealUseCopyOfTheForm,
  advertisingYourAppealWithinLast21Days, checkBoxIdentifyingTheOwners,
  errorMessageAgriculturalHolding,
  hintTextAgriculturalHolding,
  selectNo,
  selectSomeOf,
  selectYes,
  tellingTheLandOwnersToldAboutAppeal, tellingTheLandOwnersUseCopyOfTheForm, tellingTheLandOwnersWithinLast21Days,
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
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const tellingTheLandownersUrl ='/full-appeal/submit-appeal/telling-the-landowners';
const advertisingYourAppealUrl = 'full-appeal/submit-appeal/advertising-your-appeal';
const identifyingTheOwnersUrl = 'full-appeal/submit-appeal/identifying-the-owners';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const textPageCaption = 'Tell us about the appeal site';
const pageTitleAgriculturalHolding = 'Is the appeal site part of an agricultural holding? - Appeal a planning decision - GOV.UK';
const pageHeadingAgriculturalHolding = 'Is the appeal site part of an agricultural holding?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const hintText = 'An agricultural holding is land that has an agricultural tenant.';

const pageHeadingTellingTheLandowners = 'Telling the landowners';
const pageHeadingTellingTheOtherLandowners = 'Telling the other landowners';

const pageHeadingIdentifyingTheOtherLandowners = 'Identifying the other landowners';
const pageHeadingIdentifyingTheLandowners = 'Identifying the landowners';

const knowTheOwnersMethodsOwnSomeOfLandYes = () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',ownSomeOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',knowTheOwnersUrl);
};

const knowTheOwnersMethodsOwnSomeOfLandNo = () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',ownSomeOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',knowTheOwnersUrl);
}

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("an appellant or agent is on the 'Do you own all of the land involved in the appeal' page", () => {
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
});
Then("are taken to the next page 'Is the site visible from a public road'", () => {
  cy.url().should('contain', visibleFromRoadUrl);
});
Then('the {string} option is selected', (option) => {
  switch(option){
    case "Yes":
      selectYes().should('be.checked');
      break;
    case "No":
      selectNo().should('be.checked');
      break;
  }
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
Given("an appellant or agent is on the {string} page for the journey OwnSomeOfLand as 'Yes' and {string}", (CurrentPage,KnowTheOwners) => {
  switch(KnowTheOwners){
    case"Yes, I know who owns all the land":
      knowTheOwnersMethodsOwnSomeOfLandYes();
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheOtherLandowners);
      tellingTheLandOwnersToldAboutAppeal().check();
      tellingTheLandOwnersWithinLast21Days().check();
      tellingTheLandOwnersUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
    case"I know who owns some of the land":
      knowTheOwnersMethodsOwnSomeOfLandYes();
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',identifyingTheOwnersUrl);
      verifyPageHeading(pageHeadingIdentifyingTheOtherLandowners);
      checkBoxIdentifyingTheOwners().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',advertisingYourAppealUrl);
      advertisingYourAppealToldAboutAppeal().check();
      advertisingYourAppealWithinLast21Days().check();
      advertisingYourAppealUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain', tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheOtherLandowners);
      tellingTheLandOwnersToldAboutAppeal().check();
      tellingTheLandOwnersWithinLast21Days().check();
      tellingTheLandOwnersUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
    case"No, I do not know who owns any of the land":
      knowTheOwnersMethodsOwnSomeOfLandYes();
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',identifyingTheOwnersUrl);
      checkBoxIdentifyingTheOwners().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',advertisingYourAppealUrl);
      advertisingYourAppealToldAboutAppeal().check();
      advertisingYourAppealWithinLast21Days().check();
      advertisingYourAppealUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
  }
});
Given("an appellant or agent is on the {string} page for the journey OwnSomeOfLand as 'No' and {string}", (CurrentPage,KnowTheOwners) => {
  switch(KnowTheOwners){
    case"Yes, I know who owns all the land":
      knowTheOwnersMethodsOwnSomeOfLandNo();
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheLandowners);
      tellingTheLandOwnersToldAboutAppeal().check();
      tellingTheLandOwnersWithinLast21Days().check();
      tellingTheLandOwnersUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
    case"I know who owns some of the land":
      knowTheOwnersMethodsOwnSomeOfLandNo();
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',identifyingTheOwnersUrl);
      verifyPageHeading(pageHeadingIdentifyingTheLandowners);
      checkBoxIdentifyingTheOwners().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',advertisingYourAppealUrl);
      advertisingYourAppealToldAboutAppeal().check();
      advertisingYourAppealWithinLast21Days().check();
      advertisingYourAppealUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain', tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheLandowners);
      tellingTheLandOwnersToldAboutAppeal().check();
      tellingTheLandOwnersWithinLast21Days().check();
      tellingTheLandOwnersUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
    case"No, I do not know who owns any of the land":
      knowTheOwnersMethodsOwnSomeOfLandNo();
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',identifyingTheOwnersUrl);
      verifyPageHeading(pageHeadingIdentifyingTheLandowners);
      checkBoxIdentifyingTheOwners().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',advertisingYourAppealUrl);
      advertisingYourAppealToldAboutAppeal().check();
      advertisingYourAppealWithinLast21Days().check();
      advertisingYourAppealUseCopyOfTheForm().check();
      getSaveAndContinueButton().click();
      cy.url().should('contain',url);
      break;
  }
});
Then("they are presented with the {string} page", (PreviousPage) => {
  switch (PreviousPage){
    case"Telling the other landowners":
      cy.url().should('contain',tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheOtherLandowners);
      break;
    case"Telling the landowners":
      cy.url().should('contain',tellingTheLandownersUrl);
      verifyPageHeading(pageHeadingTellingTheLandowners);
      break;
    case"Advertising your appeal":
      cy.url().should('contain',advertisingYourAppealUrl);
      break;
  }
})
