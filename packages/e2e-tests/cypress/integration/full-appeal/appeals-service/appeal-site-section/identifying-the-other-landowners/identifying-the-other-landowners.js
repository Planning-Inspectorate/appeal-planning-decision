import { Given, When } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  checkBoxIdentifyingTheOwners,
  checkBoxLabelIdentifyingTheOwners,
  errorMessageIdentifyingTheOwners, identifyingTheOtherOwnersText,
  listItem1IdentifyingTheOwners, listItem2IdentifyingTheOwners,
  selectNo,
  selectSomeOf,
  selectYes,
  statementTitle,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';

const url ='full-appeal/submit-appeal/identifying-the-owners';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const advertisingYourAppealUrl = 'full-appeal/submit-appeal/advertising-your-appeal';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = "Identifying the other landowners - Appeal a planning decision - GOV.UK";
const pageHeading = 'Identifying the other landowners';
const checkBoxLabelKnowSome = "I confirm that I've attempted to identify all the other landowners, but have not been successful.";
const statementTextKnowSome = "Confirm that you have attempted to identify the other landowners";

const methodsKnowTheOwners = () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownSomeOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', knowTheOwnersUrl);
}

Given('appellant has completed full appeal eligibility journey',() => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("an Appellant or Agent is on the 'Do you know who owns the rest of the land involved in the Appeal' page", () => {
  methodsKnowTheOwners();
});
When("the user selects {string} and clicks 'Continue'", (knowTheOwners) => {
  switch (knowTheOwners){
    case "I know who owns some of the land":
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      break;
    case "No, I do not know who owns any of the land":
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
  }
});
Then("the {string} page is displayed with guidance text", (nextPage) => {
  cy.url().should('contain', url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText(textPageCaption);
  identifyingTheOtherOwnersText().should('exist');
  statementTitle().should('contain', statementTextKnowSome);
  checkBoxLabelIdentifyingTheOwners().should('contain', checkBoxLabelKnowSome);
  listItem1IdentifyingTheOwners().should('exist');
  listItem2IdentifyingTheOwners().should('exist');
});
Then("they are on the 'Do you know who owns the rest of the land involved in the Appeal' page and the option {string} is selected", (knowTheOwners) => {
  switch (knowTheOwners) {
    case "I know who owns some of the land":
      cy.url().should( 'include', knowTheOwnersUrl );
      selectSomeOf().should( 'be.checked' );
      getSaveAndContinueButton().click();
      break;
    case "No, I do not know who owns any of the land":
      cy.url().should( 'include', knowTheOwnersUrl );
      selectNo().should( 'be.checked' );
      getSaveAndContinueButton().click();
      break;
  }
});
When("they click on the Back link",()=>{
  getBackLink().click();
});

Given("an Appellant or Agent is on the {string} page for the question {string}", (currentPage,knowTheOwners) => {
  switch (knowTheOwners) {
    case "I know who owns some of the land":
      methodsKnowTheOwners();
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      cy.url().should( 'include', url );
      break;
    case "No, I do not know who owns any of the land":
      methodsKnowTheOwners();
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should( 'include', url);
      break;
  }
 });
When("the user selects the confirmation box and clicks 'Continue'", () => {
  checkBoxIdentifyingTheOwners().click();
  getSaveAndContinueButton().click();
});
Then("the user is taken to the {string}", (nextPage) => {
  cy.url().should('include', advertisingYourAppealUrl);
});
When("When they click on the 'Back' link", () => {
  getBackLink().click();
});
Then("they are presented with the {string} page for the question {string}", (currentPage,knowTheOwners) => {
  cy.url().should( 'include', url);
});
Given("an Appellant or Agent is on the 'Identifying the landowners' page", () => {
  methodsKnowTheOwners();
  selectSomeOf().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', url);
});
When("the user clicks 'Continue' without selecting the confirmation box", () => {
  getSaveAndContinueButton().click();
})
Then("they are presented with an error message {string}", (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageIdentifyingTheOwners,getErrorMessageSummary);
});
Then("they are presented with the 'Do you know who owns the land involved in the Appeal' page", () => {
  cy.url().should('include', knowTheOwnersUrl);
});



