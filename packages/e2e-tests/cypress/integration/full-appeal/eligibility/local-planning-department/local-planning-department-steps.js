import {Given, When,Then} from 'cypress-cucumber-preprocessor/steps';
import { enterLocalPlanningDepart } from '../../../../support/full-planning/eligibility/local-planning-depart/enter-local-planning-depart';
import { getContinueButton, getErrorMessageSummary} from '../../../../support/common-page-objects/common-po';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getLocalPlanningDepartmentError } from '../../../../support/full-planning/eligibility/page-objects/local-planning-department-po';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';

const pageTitle = 'Which local planning department dealt with your planning application? - Before you start - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Which local planning department dealt with your planning application?';
const url = 'before-you-start/local-planning-depart';
Given('appellant is on the Local Planning Authority Page',()=> {
  goToAppealsPage(url);
  acceptCookiesBanner();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading)
});

When('appellant selects the {string} where the application needs to be submitted',(departmentName)=>{
enterLocalPlanningDepart(departmentName);
});

When('an appellant selects an ineligible LPA',()=>{
  enterLocalPlanningDepart('Ashfield');
})

When('appellant clicks the continue button',()=>{
  getContinueButton().click();
});

Then('appellant is navigated to the planning application decision type page',()=>{
  cy.url().should('contain','/type-of-planning-application');
});

Then('appellant sees an error message {string}',(errorMessage)=>{
verifyErrorMessage(errorMessage, getLocalPlanningDepartmentError,getErrorMessageSummary);
});

Then('an appellants gets routed to shutter page which notifies them to use a different service',()=>{
cy.url().should('contain', '/before-you-start/use-a-different-service');
});

