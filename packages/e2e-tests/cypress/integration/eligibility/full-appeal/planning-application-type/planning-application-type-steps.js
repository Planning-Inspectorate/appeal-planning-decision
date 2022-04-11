import {Given, When} from 'cypress-cucumber-preprocessor/steps';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import {
  getHouseHolderPlanningRadio,
  getTypeOfPlanningApplicationError,
} from '../../../../support/eligibility/page-objects/planning-application-type-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  getBackLink,
  getErrorMessageSummary, getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { clickContinueButton } from '../../../../support/common/clickContinueButton';

const pageTitle = 'What type of planning application is your appeal about? - Before you start - Appeal a planning decision - GOV.UK';
const pageHeading = 'What type of planning application is your appeal about?';
const url = 'before-you-start/type-of-planning-application';
const listedBuildingHouseholderUrl = '/before-you-start/listed-building-householder';

Given('an appellant is on the select the type of planning application you made page',()=>{
  goToAppealsPage('before-you-start/local-planning-depart');
  acceptCookiesBanner();
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant selects {string} planning application type',(applicationType)=>{
  selectPlanningApplicationType(applicationType);
});

When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('an appellant selects the back button',()=>{
getBackLink().click();
})

Then('appellant is navigated to the About A Listed Building Page',()=>{
  cy.url().should('contain', listedBuildingHouseholderUrl);
});

Then('appellant is navigated to the is your planning application about any of the following page',()=>{
  cy.url().should('contain','/before-you-start/any-of-following');
});
Then('appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage, getTypeOfPlanningApplicationError, getErrorMessageSummary);
});

Then('an appellant is navigated to the what local planning department did you submit your application to page',()=>{
cy.url().should('contain','/before-you-start/local-planning-depart');
});
Then('any information they have inputted for planning type will not be saved',()=>{
  cy.url().should('contain','/before-you-start/local-planning-depart');
  getSaveAndContinueButton().click()
  cy.url().should('contain',url);
  getHouseHolderPlanningRadio().should('not.be.checked');
});

Then('an appellants gets routed to shutter page which notifies them to use an existing service',()=>{
  cy.url().should('contain', '/before-you-start/use-existing-service-application-type');
})

Then('appellant is presented with the page Did you apply for prior approval to extend an existing home?',()=>{
  cy.url().should('contain','/before-you-start/prior-approval-existing-home');
})
