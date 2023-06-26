import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { clickSaveAndContinue } from '../../../../../support/common/clickSaveAndContinue';

class PO_EligibilityDecisionDate {
	navigatetoEligDatePageURL() {
		goToAppealsPage('eligibility/decision-date');
	}

	validatePageTitle() {
		cy.title().should(
			'eq',
			"What's the decision date on the letter from the local planning department? - Eligibility - Appeal a planning decision - GOV.UK"
		);
	}

	validateHeaderLogo() {
		cy.get('.govuk-header__logotype');
	}

	pageHeaderlink() {
		//const headerLink = cy.get('a[href="Appeal a planning decision"]')
		cy.get('.govuk-header__content > .govuk-header__link')
			.should('have.attr', 'href')
			.and('eq', '/');
	}

	bannerText() {
		cy.get('.govuk-tag govuk-phase-banner__content__tag').should('eq', 'beta');
		cy.get('.govuk-phase-banner__text').should('eq', 'This is a new service – your ');
		cy.get('a[href="feedback"]');
		cy.get('.govuk-link').should('eg', 'will help us to improve it.');
	}

	validateText() {
		cy.get('.govuk-caption-l');
		// assert.equal(captionTextStart, 'Before you start', 'actual and expected text match')
		//const captionText = cy.get('.govuk-fieldset__heading')

		cy.get('.govuk-fieldset__heading');
		cy.get('#decision-date-hint');
		cy.get('#decision-date-day');
		cy.get('#decision-date-month');
		cy.get('#decision-date-year');
	}

	valdiatePageFooter() {
		cy.get(':nth-child(1) > .govuk-footer__heading');
		cy.get(':nth-child(2) > .govuk-footer__heading');
		cy.get(':nth-child(1) > .govuk-footer__list > :nth-child(1)');
		cy.get(':nth-child(1) > .govuk-footer__list > :nth-child(2) > .govuk-footer__link');
		cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(1)');
		cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(2)');
		cy.get(':nth-child(3) > .govuk-footer__link');
		cy.get('.govuk-footer__meta-item--grow');
		cy.get('.govuk-footer__meta > :nth-child(2) > .govuk-footer__link');
	}

	validateError() {
		cy.get('.govuk-error-summary');
		cy.get('#decision-date-error');
	}

	dateFields(Day, Month, Year) {
		if (Day) {
			cy.get('#decision-date-day').type(Day);
		}
		if (Month) {
			cy.get('#decision-date-month').type(Month);
		}
		if (Year) {
			cy.get('#decision-date-year').type(Year);
		}
	}

	dateFieldsempty(Day, Month, Year) {
		cy.get('#decision-date-day').type(Day);
		cy.get('#decision-date-month').type(Month);
		cy.get('#decision-date-year').type(Year);
	}

	continueBtn() {
		cy.wait(Cypress.env('demoDelay'));
		clickSaveAndContinue();
		cy.wait(Cypress.env('demoDelay'));
	}

	//No decision date PO's

	navigateToNoDecisionPage() {
		cy.visit('/eligibility/no-decision');
	}

	serviceText() {
		cy.get('.govuk-heading-l');
		cy.get('.govuk-body');
	}

	appealPlanningDecLink() {
		cy.get('.govuk-body > a');
	}

	appealsCaseWorkPageURL() {
		cy.get('.govuk-body > a');
	}

	appealsCaseworkPortalPage() {
		cy.visit('https://acp.planninginspectorate.gov.uk/');
		// cy.pause()
	}

	appealsCaseworkPortalPageLogiIn() {
		cy.get('#cphMainContent_LoginUser_LoginLegend');
	}

	navigateToLocalPlanDept() {
		cy.visit('https://appeals-dev.planninginspectorate.gov.uk/eligibility/planning-department');
	}

	localPlanDeptText() {
		cy.get('.govuk-label');
	}

	deadlinePassedPageText() {
		cy.get('.govuk-heading-l');
	}
}
export default PO_EligibilityDecisionDate;
