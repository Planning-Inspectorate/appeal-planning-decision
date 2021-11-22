import {Given} from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../support/go-to-page/go-to-page';
import { verifyPageTitle } from '../../support/common/verify-page-title';
import { verifyPageHeading } from '../../support/common/verify-page-heading';

const pageTitle = 'What type of planning application is your appeal about? - Before you start - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'What type of planning application is your appeal about?';
const url = '/before-you-start/type-of-planning-application';
Given('an appellant is on the select the type of planning application you made page',()=>{
  goToPage(url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant selects {string} planning application type',(applicationType)=>{
  
});
