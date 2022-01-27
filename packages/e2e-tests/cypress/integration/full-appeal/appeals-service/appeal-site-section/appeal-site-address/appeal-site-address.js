import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import {
  siteAddressLineOne,
  siteAddressLineOneErrorMessage,
  siteAddressLineTwo,
  siteAddressLineTwoErrorMessage,
  siteTownCity,
  siteTownCityErrorMessage,
  siteCounty,
  siteCountyErrorMessage,
  sitePostcode,
  sitePostcodeErrorMessage,
  pageCaption,
  pageText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-site-address-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { linkTellAboutTheAppealSite } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../../support/common/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';

const url = 'full-appeal/submit-appeal/appeal-site-address';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const ownAllTheLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = "What is the address of the appeal site? - Appeal a planning decision - GOV.UK";
const pageHeading = 'What is the address of the appeal site?';
const textPageText = 'The appeal site is the area of property or land that your planning application relates to.';

Given("an appellant is on the 'Task List' page", () => {
  goToAppealsPage(taskListUrl);
  acceptCookiesBanner();
});

When("they click the 'Tell us about the appeal site' link on the Task List page", () => {
  linkTellAboutTheAppealSite().click();
});

Then("the 'What is the address of the appeal site?' page is displayed", () => {
  cy.url().should('contain', url);
});

Given("an appellant is on the 'What is the address of the appeal site?' page", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  pageCaption().should('contain', textPageCaption);
  pageText().should('contain', textPageText);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  siteAddressLineOne().clear();
  siteAddressLineTwo().clear();
  siteTownCity().clear();
  siteCounty().clear();
  sitePostcode().clear();
});

When(
  'the appellant provides their appeal site address as {string} and {string} and {string} and {string} and {string}',
  (addressLine1, addressLine2, townCity, county, postcode) => {
    provideAddressLine1(addressLine1);
    provideAddressLine2(addressLine2);
    provideTownOrCity(townCity);
    provideCounty(county);
    providePostcode(postcode);
  },
);

And("they click the 'Continue' button", () => {
  getSaveAndContinueButton().click();
});

Then("the page 'Do you own all the land?' is displayed", () => {
  cy.url().should('contain', ownAllTheLandUrl);
});

Then("the appellant remains on the 'What is the address of the appeal site?' page", () => {
  cy.url().should('contain', url);
});

And('the appellant is informed that {string}', (reason) => {
  switch (reason) {
    case 'Enter the building and street':
      verifyErrorMessage(
        reason,
        siteAddressLineOneErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'The first line of the building and street must be 60 characters or fewer':
      verifyErrorMessage(
        reason,
        siteAddressLineOneErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'The second line of the building and street must be 60 characters or fewer':
      verifyErrorMessage(
        reason,
        siteAddressLineTwoErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'Town or City must be 60 characters or fewer':
      verifyErrorMessage(
        reason,
        siteTownCityErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'County must be 60 characters or fewer':
      verifyErrorMessage(
        reason,
        siteCountyErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'Enter the postcode':
      verifyErrorMessage(
        reason,
        sitePostcodeErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'Postcode must be 8 characters or fewer':
      verifyErrorMessage(
        reason,
        sitePostcodeErrorMessage,
        getErrorMessageSummary
      );
      break;
    case 'Enter a real postcode':
      verifyErrorMessage(
        reason,
        sitePostcodeErrorMessage,
        getErrorMessageSummary
      );
      break;
    default:
      throw new Error('Reason ' + reason + ' not found');
  }
});

When('the appellant provides a value which is too long - {string} : {int}', (component, count) => {
  const value = 'x'.repeat(count);

  switch (component) {
    case 'Address Line 1':
      provideAddressLine1(value);
      break;
    case 'Address Line 2':
      provideAddressLine2(value);
      break;
    case 'Town or City':
      provideTownOrCity(value);
      break;
    case 'County':
      provideCounty(value);
      break;
    case 'Postcode':
      providePostcode(value);
      break;
    default:
      throw new Error('Component ' + component + ' not found');
  }
});

When(
  'the appellant provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode',
  () => {
    const value = 'x'.repeat(61);
    provideAddressLine1(value);
    provideAddressLine2(value);
    provideTownOrCity(value);
    provideCounty(value);
    providePostcode(value);
  },
);

When(
  'the appellant provides values that are too long for Address Line 2 and Town or City and provides no other data',
  () => {
    const value = 'x'.repeat(61);
    provideAddressLine2(value);
    provideTownOrCity(value);
  },
);

When('the appellant provides their appeal site address with postcode as {string}', (postcode) => {
  providePostcode(postcode);
});

When("they click the 'Back' link", () => {
  getBackLink().click();
});

Then("the 'Task List' page is displayed", () => {
  cy.url().should('contain', taskListUrl);
});
