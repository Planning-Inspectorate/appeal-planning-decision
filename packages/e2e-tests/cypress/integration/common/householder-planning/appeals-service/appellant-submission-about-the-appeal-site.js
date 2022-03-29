import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { provideAddressLine1 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideCounty } from '../../../../support/common/appeal-submission-appeal-site-address/provideCounty';
import { provideTownOrCity } from '../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity';
import { providePostcode } from '../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { checkStatusForTask } from '../../../../support/householder-planning/appeals-service/appeal-submission-tasklist/checkStatusForTask';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';
import {siteAddress} from "../../../../support/householder-planning/appeals-service/page-objects/task-list-po";

When('appeal site address is requested', () => {
  siteAddress().click();
   cy.url().should('contain',pageURLAppeal.goToSiteAddressPage);
});

When('valid appeal site address is submitted', () => {
  provideAddressLine1('Address line 1');
  provideAddressLine2('Address line 2');
  provideCounty('Some county');
  provideTownOrCity('Some town');
  providePostcode('SA18 2TY');
  clickSaveAndContinue();
});

When('invalid appeal site address is submitted', () => {
  provideAddressLine1('');
  provideAddressLine2('');
  provideCounty('');
  provideTownOrCity('');
  providePostcode('');
  clickSaveAndContinue();
});

Then('Address of the appeal site section is {string}', (status) => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  checkStatusForTask('SiteAddress', status);
});

Then('Ownership of the appeal site section is {string}', (status) => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  checkStatusForTask('SiteOwnership', status);
});

Then('Access to the appeal site section is {string}', (status) => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  checkStatusForTask('SiteAccess', status);
});

Then('Health and Safety issues section is {string}', (status) => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  checkStatusForTask('HealthAndSafety', status);
});
