import {Given,When, Then} from 'cypress-cucumber-preprocessor/steps';
import {goToAppealsPage} from "../../../../support/common/go-to-page/goToAppealsPage";
import {verifyPageTitle} from "../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../support/common/verify-page-heading";
import {
  getClaimingCostNo,
  getClaimingCostsErrorMessage,
  getClaimingCostYes
} from "../../../../support/eligibility/page-objects/claiming-costs-po";
import {getContinueButton} from "../../../../support/householder-planning/appeals-service/page-objects/common-po";
import {verifyPage} from "../../../../support/common/verifyPage";
import {verifyErrorMessage} from "../../../../support/common/verify-error-message";
import {getBackLink, getErrorMessageSummary} from "../../../../support/common-page-objects/common-po";
const pageUrl = 'before-you-start/claiming-costs-householder';
const pageTitle = 'Are you claiming costs as part of your appeal? - Before you start - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Are you claiming costs as part of your appeal?';

Given('appellant is on the claiming cost page',()=>{
  goToAppealsPage(pageUrl);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant selects {string} from the options for cost',(claimingCost)=>{
  if(claimingCost === 'No'){
    getClaimingCostNo().check();
  }else{
    getClaimingCostYes().check();
  }
});

When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('appellant clicks the back button',()=>{
  getBackLink().click();
});

Then('appellant gets navigated to HAS Appeal form',()=>{
  verifyPage('/results');
});

Then('appellants gets routed to shutter page which notifies them to use a different service',()=>{
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getClaimingCostsErrorMessage(), getErrorMessageSummary);
});

Then('appellant is navigated to the enforcement notice page',()=>{
  verifyPage('/enforcement-notice');
});

Then('information they have inputted will not be saved',()=>{
  goToAppealsPage(url);
  getClaimingCostYes().should('not.be.checked');
})

