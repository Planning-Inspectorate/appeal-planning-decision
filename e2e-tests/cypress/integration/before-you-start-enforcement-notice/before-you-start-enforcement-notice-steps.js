import {Given } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../support/go-to-page/goToPage';
import { verifyPageHeading } from '../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../support/common/verify-page-title';
import {
  getEnforcementNoticeErrorMessage,
  getEnforcementNoticeNo,
  getEnforcementNoticeYes,
} from '../../support/page-objects/enforcement-notice-po';
import { getContinueButton, getErrorMessageSummary } from '../../support/page-objects/common-po';
import { verifyErrorMessage } from '../../support/common/verify-error-message';
const pageHeading = 'Have you received an enforcement notice?';
const pageTitle = 'Have you received an enforcement notice? - Before you start - Appeal a householder planning decision - GOV.UK';
const url = '/before-you-start/enforcement-notice';

Given('appellant is on the enforcement notice page',()=>{
  goToPage(url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant selects {string} from the options',(enforcementOption)=>{
  if(enforcementOption==='No'){
    getEnforcementNoticeNo().check();
  }else{
    getEnforcementNoticeYes().check();
  }
});
When('appellant clicks on the continue button',()=>{
  getContinueButton().click();
});

When('appellant selects the back button',()=>{

});

Then('appellant gets navigated to the was your planning application granted or refused page',()=>{
  cy.url().should('contain','/before-you-start/granted-or-refused');
});

Then('appellant is navigated to the shutter page',()=>{
  cy.url().should('contain','/before-you-start/use-a-different-service');
});

Then('appellant is navigated to the type of planning application page',()=>{
  cy.url().should('contain','/before-you-start/type-of-planning-application');
});

Then('appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage,getEnforcementNoticeErrorMessage, getErrorMessageSummary);
})
Then('information they have inputted will not be saved',()=>{
  goToPage(url);
  getEnforcementNoticeYes().should('not.be.checked');
})
