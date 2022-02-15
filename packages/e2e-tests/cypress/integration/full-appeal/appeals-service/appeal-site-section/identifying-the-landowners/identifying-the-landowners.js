import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import {
  checkBoxIdentifyingTheOwners,
  checkBoxLabelIdentifyingTheOwners,
  errorMessageAreYouATenant,
  errorMessageIdentifyingTheOwners,
  listItem1IdentifyingTheOwners, listItem2IdentifyingTheOwners,
  listItemIdentifyingTheOwners,
  selectNo,
  selectSomeOf,
  selectYes,
  statementTitle,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';

const url = 'full-appeal/submit-appeal/identifying-the-owners';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const advertisingYourAppealUrl = 'full-appeal/submit-appeal/advertising-your-appeal';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = 'Identifying the landowners - Appeal a planning decision - GOV.UK';
const pageHeading = 'Identifying the landowners';
const checkBoxLabelKnowSome = "I confirm that I've attempted to identify all the landowners, but have not been successful.";
const checkBoxLabelNoIDoNotKnow = "I confirm that I've taken all reasonable steps to identify the landowners";
const statementTextKnowSome = "Confirm that you have attempted to identify the landowners";
const statementTextKnowNoOne = "Have you taken all reasonable steps to identify the landowners?";
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';

const pageMethodsKnowTheOwners = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain',ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',ownSomeOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',knowTheOwnersUrl);
}

Given("an Appellant or Agent is on the 'Do you know who owns the land involved in the appeal' page", () => {
  pageMethodsKnowTheOwners();
})

When("the user selects {string} and clicks 'Continue' button", (option) => {
  switch (option) {
    case 'I know who owns some of the land':
      selectSomeOf().click()
      getSaveAndContinueButton().click();
      break;
    case 'No, I do not know who owns any of the land':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
});
Then("'Identifying the landowners' page is displayed", () => {
  cy.url().should('contain',url);
 })
Then("'Identifying the landowners' page is displayed with text 'Have you taken all reasonable steps to identify the landowners?'", () => {
  cy.url().should('contain',url);
 statementTitle().should('contain.text', statementTextKnowNoOne);
  checkBoxLabelIdentifyingTheOwners().should('contain.text', checkBoxLabelNoIDoNotKnow);
})
Then("the checkbox should not be selected", () => {
  checkBoxIdentifyingTheOwners().should('not.be.checked');
})
When("the user clicks 'Continue' without selecting the confirmation box", () => {
  getSaveAndContinueButton().click();
})

Then('they are presented with an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageIdentifyingTheOwners, getErrorMessageSummary);
});
Given("an Appellant or Agent is on the 'Identifying the landowners' page", () => {
  pageMethodsKnowTheOwners();
  selectSomeOf().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
  checkBoxLabelIdentifyingTheOwners().should('contain', checkBoxLabelKnowSome);
  listItem1IdentifyingTheOwners().should('exist');
  listItem2IdentifyingTheOwners().should('exist');
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText(textPageCaption);
})
Given("an Appellant or Agent is on the 'Identifying the landowners' page for the option 'No, I do not know who owns any of the land'", () => {
  pageMethodsKnowTheOwners();
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
  checkBoxLabelIdentifyingTheOwners().should('contain', checkBoxLabelNoIDoNotKnow);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText(textPageCaption);
})
Given("a statement 'Confirm that you have attempted to identify the landowners' is displayed", () => {
  statementTitle().should('contain', statementTextKnowSome);
})
When("the user selects the confirmation box and clicks 'Continue'", () => {
  checkBoxIdentifyingTheOwners().click();
  getSaveAndContinueButton().click();
})
Then("the user is taken to the next page 'Advertising your appeal'", () => {
  cy.url().should('contain',advertisingYourAppealUrl);
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Do you know who owns the land involved in the appeal' page and 'No' option is selected", () => {
  cy.url().should('contain',knowTheOwnersUrl);
  selectNo().should('be.checked');
})
Then("they are presented with the 'Do you know who owns the land involved in the appeal' page and 'I know' option is selected", () => {
  cy.url().should('contain',knowTheOwnersUrl);
  selectSomeOf().should('be.checked');
})
