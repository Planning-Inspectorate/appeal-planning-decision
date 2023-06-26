import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import format from 'date-fns/format';
import { provideCompleteAppeal } from '../../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import {
	STANDARD_AGENT_APPEAL,
	STANDARD_APPEAL
} from '../../../../common/householder-planning/appeals-service/standard-appeal';
import { agreeToTheDeclaration } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { confirmNavigationPageNotFoundPage } from '../../../../../support/householder-planning/appeals-service/errors/confirmNavigationPageNotFoundPage';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

Given('an {string} has submitted an appeal', (appellantOrAgent) => {
	const appeal = appellantOrAgent === 'appellant' ? STANDARD_APPEAL : STANDARD_AGENT_APPEAL;
	provideCompleteAppeal(appeal);
	clickCheckYourAnswers();
	getSaveAndContinueButton().click();
	agreeToTheDeclaration();
});

Given('an agent or appellant has submitted an appeal', () => {
	provideCompleteAppeal(STANDARD_APPEAL);
	clickCheckYourAnswers();
	getSaveAndContinueButton().click();
	agreeToTheDeclaration();
});

When('your planning appeal page is viewed with a valid appealId', () => {
	confirmAppealSubmitted();
	cy.get('[data-cy="submission-information-appeal-id"]')
		.invoke('val')
		.then((appealId) => {
			goToAppealsPage(`your-planning-appeal/${appealId}`);
		});
});

When('your planning appeal page is viewed with an incorrect appealId', () => {
	goToAppealsPage('your-planning-appeal/unknown-appeal-id', { failOnStatusCode: false });
});

Then(
	'the user sees the appropriate general data for {string} along with data for step 1',
	(appellantOrAgent) => {
		let isAppellant = appellantOrAgent === 'appellant';
		const appeal = isAppellant ? STANDARD_APPEAL : STANDARD_AGENT_APPEAL;
		const appellantName = isAppellant
			? appeal.aboutYouSection.yourDetails.name
			: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;
		cy.get('[data-cy="appellant-name"]').should('have.text', appellantName);
		cy.get('[data-cy="appellant-address"]').should(
			'have.text',
			`${appeal.appealSiteSection.siteAddress.addressLine1}${appeal.appealSiteSection.siteAddress.addressLine2}${appeal.appealSiteSection.siteAddress.town}${appeal.appealSiteSection.siteAddress.county}${appeal.appealSiteSection.siteAddress.postcode}`
		);
		cy.get('[data-cy="appeal-submission-date"]').should(
			'have.text',
			format(new Date(), 'd MMMM yyyy')
		);
	}
);

Then('the user sees the label for appellant name as {string}', (label) => {
	cy.get('[class=govuk-summary-list__key]').first().should('contain', label);
});

Then('the user sees the 404 page', () => {
	confirmNavigationPageNotFoundPage();
});
