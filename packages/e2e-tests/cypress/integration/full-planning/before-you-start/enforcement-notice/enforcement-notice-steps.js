import {Given,When,Then } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import {
  getEnforcementNoticeErrorMessage,
  getEnforcementNoticeNo, getEnforcementNoticeYes,
} from '../../../../support/full-planning/before-you-start/page-objects/enforcement-notice-po';
import { getContinueButton, getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
const pageHeading = 'Have you received an enforcement notice?';
const pageTitle = 'Have you received an enforcement notice? - Before you start - Appeal a planning decision - GOV.UK';
const url = '/before-you-start/enforcement-notice';

Given('appellant is on the enforcement notice page',()=>{
  goToPage(url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant selects {string} from the options',(enforcementOption)=>{
  if(enforcementOption==='No'){
    getEnforcementNoticeNo().click();
  }else{
    getEnforcementNoticeYes().check();
  }
});
When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('appellant selects the back button',()=>{
getBackLink().click();
});

Then('appellant gets navigated to the was your planning application granted or refused page',()=>{
  cy.url().should('contain','/before-you-start/granted-or-refused');
});

Then('appellant is navigated to the shutter page',()=>{
  cy.url().should('contain','/before-you-start/use-a-different-service');
});

Then('appellant is navigated to the any of the following page',()=>{
  cy.url().should('contain','/before-you-start/any-of-following');
});

Then('appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage,getEnforcementNoticeErrorMessage, getErrorMessageSummary);
})
Then('information they have inputted will not be saved',()=>{
  goToPage(url);
  getEnforcementNoticeYes().should('not.be.checked');
})
