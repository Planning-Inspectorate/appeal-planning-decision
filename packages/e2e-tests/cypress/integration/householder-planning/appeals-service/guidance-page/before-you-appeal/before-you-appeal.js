import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { userIsNavigatedToPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

const title = 'Before you appeal - Appeal a planning decision - GOV.UK';

Given('the appellant is on the before you appeal page', () => {
	goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
	verifyPageTitle(title);
	verifyPageHeading('Appeal a planning decision');
});

Then('information about when you can appeal is provided', () => {
	userIsNavigatedToPage('/when-you-can-appeal');
});
