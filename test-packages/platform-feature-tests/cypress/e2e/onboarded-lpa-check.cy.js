import { BasePage } from '../page-objects/base-page';
import { BeforeYouStart } from '../page-objects/before-you-start';
import { EnterLpa } from '../page-objects/before-you-start/select-lpa';
import { localPlanningAuthorities } from '../fixtures/lpas.json';

const basePage = new BasePage();
const beforeYouStart = new BeforeYouStart();
const enterLpa = new EnterLpa();

describe('Check access to appeals service for granted LPAs', () => {
	beforeEach(() => {
		// Step 1: Visit the appeals service before you start page
		cy.visit('https://appeals-service-test.planninginspectorate.gov.uk/before-you-start');

		// Step 2: Selects the contiune button on before you start page
		basePage.clickContinueBtn();

		// Step 3: Checks we are on the local planning department page
		cy.url().should('include', 'local-planning-department');
	});

	localPlanningAuthorities.forEach((localPlanningAuthorities) => {
		it('Enter "' + localPlanningAuthorities + '" planning authortiy', () => {
			// Step 4: Enters Local planning authority
			enterLpa.enterLPA(localPlanningAuthorities);

			// Step 5: Selects Local planning authority from drop down list
			enterLpa.selectLPA();

			// Step 6: Selects Contiune Button
			basePage.clickSaveAndContiuneBtn();

			// Step 7: Checks we are on the type of planning application page
			cy.url().should('include', '/type-of-planning-application');
		});
	});
});
