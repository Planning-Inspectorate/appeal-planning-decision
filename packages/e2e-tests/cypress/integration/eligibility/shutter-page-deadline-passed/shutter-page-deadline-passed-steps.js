import {Given} from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../support/common/verify-page-heading';
import { goToAppealsPage } from '../../../support/common/go-to-page/goToAppealsPage';
const pageHeading = 'You cannot appeal.';
const pageTitle = 'You cannot appeal - Before you start - Appeal a planning decision - GOV.UK';
const pageUrl='before-you-start/you-cannot-appeal';
Given('an appellant is on the shutter page for date passed for appeal',()=>{
  goToAppealsPage(pageUrl);
});

Then('appellant is displayed details for  out of time shutter page',()=>{
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
})
