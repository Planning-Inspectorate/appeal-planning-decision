import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../support/common/accept-cookies-banner';
import { verifyPageTitle } from '../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../support/common/verify-page-heading';
import { verifyPage } from '../../../support/common/verifyPage';
import { clickStartButton } from '../../../support/common/clickStartButton';

Given('appellant is on the Before You Start first page', () => {
  goToAppealsPage('before-you-start');
  acceptCookiesBanner();
  verifyPageTitle('Before you start - Appeal a planning decision - GOV.UK');
  verifyPageHeading('Before you start');
});

When('appellant clicks on the continue button', () => {
  clickStartButton();
});

Then('appellant is navigated to the Local Planning Department page', () => {
  verifyPage('before-you-start/local-planning-department');
});
