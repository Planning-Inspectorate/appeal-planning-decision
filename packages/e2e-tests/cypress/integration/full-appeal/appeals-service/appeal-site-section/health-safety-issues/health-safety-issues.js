import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  selectNo,
  selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {
  provideDetails,
  errorMessageHealthSafetyIssuesDetails,
  errorMessageHealthSafetyIssues,
} from '../../../../../support/full-appeal/appeals-service/page-objects/health-safety-issues-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';

const url = 'full-appeal/submit-appeal/health-safety-issues';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitleHealthSafetyIssues = 'Are there any health and safety issues on the appeal site? - Appeal a planning decision - GOV.UK';
const pageHeadingHealthSafetyIssues = 'Are there any health and safety issues on the appeal site?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const healthSafetyIssuesDetailsError = 'Tell us about the health and safety issues';
const healthSafetyIssuesError = 'Select yes if there are any health and safety issues on the appeal site';

Given("an appellant or agent is on the 'Is the site visible from a public road?' page", () => {
  goToAppealsPage(taskListUrl);
  acceptCookiesBanner();
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', visibleFromRoadUrl);
});
When("the user selects {string} and clicks 'Continue'", (option) => {
  switch (option) {
    case 'Yes':
      selectYes().click()
      getSaveAndContinueButton().click();
      break;
    case 'No':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
});
When("the user selects 'Yes' and enters details about the health and safety issues and clicks 'Continue'", () => {
  selectYes().click();
  provideDetails();
  getSaveAndContinueButton().click();
});
Then("the 'Are there any health and safety issues on the appeal site?' page is displayed", () => {
  cy.url().should('contain', url);
});
Given("an appellant or agent is on the 'Are there any health and safety issues on the appeal site?' page", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  verifyPageHeading(pageHeadingHealthSafetyIssues);
  verifyPageTitle(pageTitleHealthSafetyIssues)
  pageCaptionText().should('contain', textPageCaption);
});
Then("the user is taken to the 'Task List' page", () => {
  cy.url().should('contain', taskListUrl);
});
Then('they are presented with an error message {string}', (errorMessage) => {
  switch (errorMessage) {
    case healthSafetyIssuesDetailsError:
      verifyErrorMessage(healthSafetyIssuesDetailsError, errorMessageHealthSafetyIssuesDetails, getErrorMessageSummary);
      break;
    case healthSafetyIssuesError:
      verifyErrorMessage(healthSafetyIssuesError, errorMessageHealthSafetyIssues, getErrorMessageSummary);
      break;
  }
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are taken to the 'Is the site visible from a public road?' page", () => {
  cy.url().should('contain', visibleFromRoadUrl);
});
