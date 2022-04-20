import {Given} from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
// import { getACPLink } from '../../../../support/eligibility/page-objects/shutter-page-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { getLocalPlanningDepart } from '../../../../support/eligibility/page-objects/local-planning-department-po';
import { getSaveAndContinueButton } from '../../../../support/common-page-objects/common-po';
import {acceptCookiesBanner} from "../../../../support/common/accept-cookies-banner";
const url = 'before-you-start/use-existing-service-local-planning-department';
const pageHeading = 'You need to use the existing service';
const pageTitle =
  'You need to use the existing service - Before you start - Appeal a planning decision - GOV.UK';
Given('an appellant is on the shutter page', () => {
  goToAppealsPage('before-you-start/local-planning-depart');
  acceptCookiesBanner();
  getLocalPlanningDepart().select('Amber Valley');
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
});

When('an appellant clicks on the you can appeal using our appeals casework portal link', () => {
  cy.get('button').click();
});

Then('an appellant is able to navigate to casework appeal portal',()=>{
  cy.url().should('eq','https://acp.planninginspectorate.gov.uk/');
})

Then('appellant is displayed details for shutter page',()=>{
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});
