import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
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
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import {
  errorMessageKnowTheOwners,
   selectNo, selectSomeOf,
  selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';

const url = 'full-appeal/submit-appeal/know-the-owners';
const someOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const tellAllLandOwnersUrl = 'full-appeal/submit-appeal/telling-the-landowners';
const identifyTheOwnersUrl = 'full-appeal/submit-appeal/identifying-the-owners';
const textPageCaption = 'Tell us about the appeal site';
const pageTitleRestOfLand = 'Do you know who owns the rest of the land involved in the appeal? - Appeal a planning decision - GOV.UK';
const pageTitleOwnTheLand = 'Do you know who owns the land involved in the appeal? - Appeal a planning decision - GOV.UK';
const pageHeadingRestOfLand = 'Do you know who owns the rest of the land involved in the appeal?';
const pageHeadingOwnTheLand = 'Do you know who owns the land involved in the appeal?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const callMethodsTillSomeOfLandUrl = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', someOfLandUrl);
}

Given("an appellant or agent is on the 'Do you own some of the land involved in the appeal' page", () => {
  callMethodsTillSomeOfLandUrl();
});
Then("'Do you know who owns the rest of the land involved in the appeal?' page is displayed", () => {
  cy.url().should('contain', url);
  cy.checkPageA11y();
  verifyPageTitle(pageTitleRestOfLand);
  verifyPageHeading(pageHeadingRestOfLand);
  pageCaptionText(textPageCaption);
});
When("the user select {string} and click 'Continue'", (option) => {
  switch (option) {
    case 'Yes':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'No':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'Yes, I know who owns all the land':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'I know who owns some the land':
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      break;
    case 'No, I do not know who owns any of the land':
      selectNo().click();
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
});
When("they click on the 'Back' link",()=> {
    getBackLink().click();
});
Then('they are presented with an error message {string}', (errorMessage) => {
    verifyErrorMessage(errorMessage,errorMessageKnowTheOwners, getErrorMessageSummary);
});
Then("'Do you know who owns the land involved in the appeal' page is displayed", () => {
  cy.url().should('contain',url);
  verifyPageHeading(pageHeadingOwnTheLand);
});
Given("an appellant or agent is on the 'Do you know who owns the land involved in the appeal' page", () => {
  callMethodsTillSomeOfLandUrl();
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageHeading(pageHeadingOwnTheLand);
});

Given("an appellant or agent is on the current page {string} page", (currentpage) => {
  switch (currentpage) {
    case 'Do you know who owns the rest of the land involved in the appeal?' :
      callMethodsTillSomeOfLandUrl();
      selectYes().click();
      getSaveAndContinueButton().click();
      verifyPageTitle(pageTitleRestOfLand);
      verifyPageHeading(pageHeadingRestOfLand);
      pageCaptionText(textPageCaption);
      cy.checkPageA11y();
      break;
    case 'Do you know who owns the land involved in the appeal' :
      callMethodsTillSomeOfLandUrl();
      selectNo().click();
      getSaveAndContinueButton().click();
      verifyPageHeading(pageHeadingOwnTheLand);
      verifyPageTitle(pageTitleOwnTheLand);
      pageCaptionText(textPageCaption);
      cy.checkPageA11y();
      break;
  }
  });
Then("the user will be taken to the next page {string}", (nextpage) => {
  switch (nextpage) {
    case 'Telling the other landowners':
      cy.url().should('contain', tellAllLandOwnersUrl);
      break;
    case 'Identifying the other landowners':
      cy.url().should('contain', identifyTheOwnersUrl);
      break;
  }
});

