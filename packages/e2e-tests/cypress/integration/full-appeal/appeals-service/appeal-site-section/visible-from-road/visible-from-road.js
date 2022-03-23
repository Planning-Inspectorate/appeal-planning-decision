import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  selectNo,
  selectYes, textBox,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {
  notVisibleFromLandProvideDetails,
  errorMessageVisibleFromRoadDetails,
  errorMessageVisibleFromRoad,
} from '../../../../../support/full-appeal/appeals-service/page-objects/visible-from-road-po';
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
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';

const url = 'full-appeal/submit-appeal/visible-from-road';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const healthSafetyIssuesUrl = '/full-appeal/submit-appeal/health-safety-issues';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitleVisibleFromRoad = 'Is the site visible from a public road? - Appeal a planning decision - GOV.UK';
const pageHeadingVisibleFromRoad = 'Is the site visible from a public road?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const visibleFromRoadErrorNoOption = 'Tell us how visibility is restricted';
const visibleFromRoadDetailsErrorTextBox = 'How visibility is restricted must be 255 characters or less';
const visibleFromRoadError = 'Select yes if the site is visible from a public road';

Given("an appellant or agent is on the 'Is the appeal site part of an agricultural holding?' page", () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
});
When("the user selects {string} and clicks 'Continue'", (option) => {
  selectRadioButton(option);
});
When( "the user selects No and Enter more than 255 characters in the text box and clicks 'Continue'", () => {
  const count = 255;
  const value = 'x'.repeat(count + 1);
  selectNo().click();
  textBox().clear().type(value);
  getSaveAndContinueButton().click();
} );

When("the user selects 'No' and enters details about how the visibility is restricted and clicks 'Continue'", (option) => {
  selectNo().click();
  notVisibleFromLandProvideDetails().type(`{selectall}{backspace}The site is behind a tall wall`);
  getSaveAndContinueButton().click();
});
Then("the 'Is the site visible from a public road?' page is displayed", () => {
  cy.url().should('contain', url);
  });
Given("an appellant or agent is on the 'Is the site visible from a public road?' page", () => {
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
  cy.url().should('contain', url);
  cy.checkPageA11y();
  verifyPageHeading(pageHeadingVisibleFromRoad);
  verifyPageTitle(pageTitleVisibleFromRoad)
  pageCaptionText().should('contain', textPageCaption);
  })
Then("the user is taken to the next page 'Are there any health and safety issues on the appeal site?'", () => {
  cy.url().should('contain', healthSafetyIssuesUrl);
});
Then('they are presented with an error message {string}', (errorMessage) => {
  switch (errorMessage) {
    case visibleFromRoadErrorNoOption:
      verifyErrorMessage(visibleFromRoadErrorNoOption, errorMessageVisibleFromRoadDetails, getErrorMessageSummary);
      break;
    case visibleFromRoadError:
      verifyErrorMessage(visibleFromRoadError, errorMessageVisibleFromRoad, getErrorMessageSummary);
      break;
    case visibleFromRoadDetailsErrorTextBox:
      verifyErrorMessage(visibleFromRoadDetailsErrorTextBox, errorMessageVisibleFromRoadDetails, getErrorMessageSummary);
      break;
  }
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Is the appeal site part of an agricultural holding?' page", () => {
  cy.url().should('contain', agriculturalHoldingUrl);
});
