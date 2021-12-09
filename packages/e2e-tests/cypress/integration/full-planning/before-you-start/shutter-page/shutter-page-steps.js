
import {Given} from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { getACPLink } from '../../../../support/full-planning/before-you-start/page-objects/shutter-page-po';
const url = '/before-you-start/use-a-different-service';
const pageHeading = 'You need to use a different service';
const pageTitle = 'You need to use a different service - Before you start - Appeal a planning decision - GOV.UK';
Given('an appellant is on the shutter page',()=>{
  goToPage(url);
});
Given('an appellant is presented with a link to use a different service',()=>{
getACPLink().should('be.visible')
  .should('have.attr','href');
});
When('an appellant clicks on the you can appeal using our appeals casework portal link',()=>{
  getACPLink().click();
});

Then('an appellant is able to navigate to casework appeal portal',()=>{
  cy.url().should('eq','https://acp.planninginspectorate.gov.uk/');
})

Then('appellant is displayed details for shutter page',()=>{
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});
