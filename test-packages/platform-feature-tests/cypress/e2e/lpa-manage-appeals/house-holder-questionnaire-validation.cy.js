/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from '../../page-objects/base-page';
import { houseHolderQuestionnaireTestCases } from '../../helpers/lpaManageAppeals/houseHolderQuestionnaireData';
import { users } from '../../fixtures/users.js';
const {
	YourAppealsSelector
} = require('../../page-objects/lpa-manage-appeals/your-appeals-selector');

describe('LPA Manage House Holder Apppeal Questionnaire validation',{ tags:'@HAS-LPAQ-Validation-1' }, () => {
	const basePage = new BasePage();
	const yourAppealsSelector = new YourAppealsSelector();
	let lpaManageAppealsData;
	before(() => {
			cy.login(users.appeals.authUser);
		});
	beforeEach(() => {		
		cy.fixture('lpaManageAppealsData').then((data) => {
			lpaManageAppealsData = data;
		});
		cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
		cy.url().then((url) => {
			if (url.includes('/manage-appeals/your-email-address')) {
				cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
				cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(
					lpaManageAppealsData?.emailAddress
				);
				cy.advanceToNextPage();
				cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
				cy.advanceToNextPage();
			}
		});
	});

	it(`LPA Manage Your Appeals`, () => {
		cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);
	});

	it(`Add and Remove user link validation`, () => {
		cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
	});

	it(`Your Appeals tab`, () => {
		cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
	});
	it(`Appeal Id Hyperlink`, () => {
		cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
	});

	it(`Questionnaire Hyperlink `, () => {
		cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
	});

	it(`Waiting for review tab`, () => {
		cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
	});
});

describe('House Holder appleal questionnaire validation',{ tags:'@HAS-LPAQ-Validation-2' }, () => {
	const basePage = new BasePage();
	const yourAppealsSelector = new YourAppealsSelector();
	const context = houseHolderQuestionnaireTestCases[0];
	let lpaManageAppealsData;
	let appealId;
	before(() => {
			cy.login(users.appeals.authUser);
		});
	beforeEach(() => {
		cy.fixture('lpaManageAppealsData').then(data => {
			lpaManageAppealsData = data;
		})
		cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
		cy.url().then((url) => {
			if (url.includes('/manage-appeals/your-email-address')) {
				cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
				cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
				cy.advanceToNextPage();
				cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
				cy.advanceToNextPage();
			}
		});
		let counter = 0;
		cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
			const rowtext = $row.text();
			if (rowtext.includes(lpaManageAppealsData?.hasAppealType) && rowtext.includes(lpaManageAppealsData?.todoQuestionnaire)) {
				if (counter === 0) {
					cy.wrap($row).within(() => {
						cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.hasAppealType).should('be.visible');
						cy.get('a').each(($link) => {
							if ($link.attr('href')?.includes(lpaManageAppealsData?.questionnaireLink)) {
								appealId = $link.attr('href')?.split('/').pop();
								cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
								return false;
							}
						});
					});
				}
				counter++;
			}
		});
	})
	it(`House Holder appleal questionnaire url`, () => {

		cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

	});

	it(`Validate House Holder questionnaire appeal type answer link`, () => {
		cy.get(basePage?._selectors.agovukLink).should('exist').each(($link) => {
			if ($link.is(':visible')) {
				cy.wrap($link).invoke('text').then((text) => {
					const trimmedText = text.trim()
					if (trimmedText === 'Answer') {
						cy.wrap($link).should('have.text', 'Answer').and('be.visible')
					}
				})
			}
		})
	});
	//  1. Constraints, designations and other issues section validations
	it(`Validate House Holder questionnaire appeal type error validation`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey).contains('Is a householder appeal the correct type of appeal?').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.agovukLink).then(($link) => {
			const linkText = $link.text().split('Is a householder appeal the correct type of appeal?')[0].trim();

			if (linkText === 'Answer') {
				cy.wrap($link).should('be.visible').click({ force: true });
				cy.advanceToNextPage();
				cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#correctAppealType').and('contain.text', 'Select yes if this is the correct type of appeal');
			}
			else if (linkText === 'Change') {
				cy.get(basePage?._selectors.govukSummaryListKey).contains('Is a householder appeal the correct type of appeal?').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.govukSummaryListValue).should('not.have.text', 'Not started').and('be.visible');
			}
		});
	});

	it(`Validate House Holder questionnaire Affects a listed building`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Affects a listed building')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Does the proposed development affect the setting of listed buildings?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#affectsListedBuilding')
						.and(
							'contain.text',
							'Select yes if the proposed development affects the setting of listed buildings'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Affects a listed building')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Listed building or site has been added to the case validation`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Affects a listed building')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Does the proposed development affect the setting of listed buildings?')[0]
					.trim();
				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#affectsListedBuilding')
						.and(
							'contain.text',
							'Select yes if the proposed development affects the setting of listed buildings'
						);
				} else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					if (context?.constraintsAndDesignations?.isChangesListedBuilding) {
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#affectedListedBuildingNumber')
							.and('contain.text', 'Enter a list entry number');
					}
				}
			});
	});

	it(`Validate House Holder questionnaire Conversation Area`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey).contains('Conservation area').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.agovukLink).then(($link) => {
			const linkText = $link.text().split(' Is the site in, or next to a conservation area?')[0].trim();
			if (linkText === 'Answer') {
				cy.wrap($link).should('be.visible').click({ force: true });
				cy.advanceToNextPage();
				cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#conservationArea').and('contain.text', 'Select yes if the site is in, or next to a conservation area');
			}
			else if (linkText === 'Change') {
				cy.get(basePage?._selectors.govukSummaryListKey).contains('Conservation area').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.govukSummaryListValue).should('not.have.text', 'Not started').and('be.visible');
			}
		});
	});

	it(`Validate House Holder questionnaire Conservation area map and guidance`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Conservation area')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(' Is the site in, or next to a conservation area?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#conservationArea').and('contain.text', 'Select yes if the site is in, or next to a conservation area');
				}
				else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();

					if (context?.constraintsAndDesignations?.isConservationArea) {
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#uploadConservation')
							.and('contain.text', 'Select a conservation map and guidance');
					}

					// cy.get(basePage?._selectors.govukSummaryListKey).contains('Conservation area').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.govukSummaryListValue).should('not.have.text', 'Not started').and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Green Belt`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Green belt')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link.text().split('Is the site in a green belt?')[0].trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#greenBelt')
						.and('contain.text', 'Select yes if the site is in a green belt');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Green belt')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	// 2. Notifying relevant parties of the application section validations
	it(`Validate House Holder questionnaire Who was notified`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Who was notified')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link.text().split('Who did you notify about this application?')[0].trim();

				if (linkText === 'Upload') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#uploadWhoNotified')
						.and('contain.text', 'Select your document that lists who you notified');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Who was notified')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Type of notification`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Type of notification')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('How did you notify relevant parties about the planning application?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#notificationMethod')
						.and('contain.text', 'Select how you notified people about the planning application');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Type of notification')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	// 3. Consultation responses and representations
	it(`Validate House Holder questionnaire Representations from other parties`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Representations from other parties')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(' Did you receive representations from members of the public or other parties?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#otherPartyRepresentations')
						.and(
							'contain.text',
							'Select yes if you received representations from members of the public or other parties'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Representations from other parties')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Upload representations from other parties`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Representations from other parties')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(' Did you receive representations from members of the public or other parties?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#otherPartyRepresentations')
						.and(
							'contain.text',
							'Select yes if you received representations from members of the public or other parties'
						);
				} else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();

					if (context?.consultResponseAndRepresent?.isOtherPartyRepresentations) {
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#uploadRepresentations')
							.and('contain.text', 'Select the representations');
					}
				}
			});
	});

	// //4. Planning officer's report and supporting documents
	it(`Validate House Holder questionnaire Upload planning officer’s report`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Who was notified')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(
						'Upload the planning officer’s report or what your decision notice would have said'
					)[0]
					.trim();

				if (linkText === 'Upload') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#uploadPlanningOfficerReport')
						.and(
							'contain.text',
							'Select the planning officer’s report or what your decision notice would have said'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Who was notified')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Upload the plans, drawings and list of plans`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Upload the plans, drawings and list of plans')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Upload the plans, drawings and list of plans')[0]
					.trim();

				if (linkText === 'Upload') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#uploadPlansDrawings').and('contain.text', 'Select the plans, drawings and list of plans');
				}
				else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey).contains('Upload the plans, drawings and list of plans').closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.govukSummaryListValue).should('not.have.text', 'Not started').and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Emerging plans`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Emerging plans')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Do you have an emerging plan that is relevant to this appeal?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#emergingPlan')
						.and(
							'contain.text',
							'Select yes if you have an emerging plan that is relevant to this appeal'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Emerging plans')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Upload emerging plan and supporting information`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Emerging plans')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Do you have an emerging plan that is relevant to this appeal?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#emergingPlan')
						.and(
							'contain.text',
							'Select yes if you have an emerging plan that is relevant to this appeal'
						);
				} else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();

					if (context?.poReportAndSupportDocs?.isEmergingPlan) {
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#uploadEmergingPlan')
							.and('contain.text', 'Select the emerging plan and supporting information');
					}
				}
			});
	});

	it(`Validate House Holder questionnaire Supplementary planning documents`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Supplementary planning documents')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(
						'Did any supplementary planning documents inform the outcome of the application?'
					)[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#supplementaryPlanningDocs')
						.and(
							'contain.text',
							'Select yes if any supplementary planning documents informed the outcome of the application'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Supplementary planning documents')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Upload supplementary planning documents`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Supplementary planning documents')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split(
						'Did any supplementary planning documents inform the outcome of the application?'
					)[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#supplementaryPlanningDocs')
						.and(
							'contain.text',
							'Select yes if any supplementary planning documents informed the outcome of the application'
						);
				} else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();

					if (context?.poReportAndSupportDocs?.isSupplementaryPlanningDocs) {
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#uploadSupplementaryPlanningDocs')
							.and(
								'contain.text',
								'Select the relevant policy extracts and supplementary planning documents'
							);
					}
				}
			});
	});

	// //  5. Site access
	it(`Validate House Holder questionnaire Access for inspection`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Access for inspection')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Might the inspector need access to the appellant’s land or property?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#lpaSiteAccess')
						.and(
							'contain.text',
							'Select yes if the inspector might need access to the appellant’s land or property'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Access for inspection')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Might the inspector need to enter a neighbour’s land or property?`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Might the inspector need to enter a neighbour’s land or property?')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Might the inspector need to enter a neighbour’s land or property?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#neighbourSiteAccess')
						.and(
							'contain.text',
							'Select yes if the inspector might need to enter a neighbour’s land or property'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Might the inspector need to enter a neighbour’s land or property?')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Potential safety risks`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Potential safety risks')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link.text().split('Add potential safety risks')[0].trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#lpaSiteSafetyRisks')
						.and('contain.text', 'Select yes if there are any potential safety risks');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Potential safety risks')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	// //6. Appeal process
	it(`Validate House Holder questionnaire Appeals near the site`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Appeals near the site')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Are there any other ongoing appeals next to, or close to the site?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#nearbyAppeals')
						.and(
							'contain.text',
							'Select yes if there are any other ongoing appeals next to, or close to the site'
						);
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Appeals near the site')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	it(`Validate House Holder questionnaire Other appeal`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Appeals near the site')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link
					.text()
					.split('Are there any other ongoing appeals next to, or close to the site?')[0]
					.trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#nearbyAppeals')
						.and(
							'contain.text',
							'Select yes if there are any other ongoing appeals next to, or close to the site'
						);
				} else if (linkText === 'Change') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();

					if (context?.appealProcess?.isNearbyAppeals) {
						cy.advanceToNextPage();
						cy.advanceToNextPage();

						cy.get(basePage?._selectors.govukErrorSummaryList)
							.find('a')
							.should('have.attr', 'href', '#nearbyAppealReference')
							.and('contain.text', 'Enter an appeal reference number');
					}
				}
			});
	});

	it(`Validate House Holder questionnaire Extra conditions`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Appeals near the site')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link.text().split('Add new planning conditions to this appeal')[0].trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#newConditions')
						.and('contain.text', 'Select yes if there are any new conditions');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Appeals near the site')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});

	// // 7. Submit

	it(`Validate House Holder questionnaire Submit`, () => {
		cy.get(basePage?._selectors.govukSummaryListKey)
			.contains('Appeals near the site')
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then(($link) => {
				const linkText = $link.text().split('Add new planning conditions to this appeal')[0].trim();

				if (linkText === 'Answer') {
					cy.wrap($link).should('be.visible').click({ force: true });
					cy.advanceToNextPage();
					cy.get(basePage?._selectors.govukErrorSummaryList)
						.find('a')
						.should('have.attr', 'href', '#newConditions')
						.and('contain.text', 'Select yes if there are any new conditions');
				} else if (linkText === 'Change') {
					cy.get(basePage?._selectors.govukSummaryListKey)
						.contains('Appeals near the site')
						.closest(basePage?._selectors.govukSummaryListRow)
						.find(basePage?._selectors.govukSummaryListValue)
						.should('not.have.text', 'Not started')
						.and('be.visible');
				}
			});
	});
});
