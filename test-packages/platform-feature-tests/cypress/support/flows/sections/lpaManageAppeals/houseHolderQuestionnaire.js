/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { AppealProcess } from "../../pages/lpa-manage-appeals/appealProcess";
import { ConstraintsAndDesignations } from "../../pages/lpa-manage-appeals/constraintsAndDesignations";
import { ConsultResponseAndRepresent } from "../../pages/lpa-manage-appeals/consultResponseAndRepresent";
import { NotifyParties } from "../../pages/lpa-manage-appeals/notifyParties";
import { PoReportAndSupportDocs } from "../../pages/lpa-manage-appeals/poReportAndSupportDocs";
import { SiteAccess } from "../../pages/lpa-manage-appeals/siteAccess";
import { waitingForReview } from "../../pages/lpa-manage-appeals/waitingForReview";

// Unified questionnaire flow for Householder and CAS Planning (adverts) appeals.
// Behavioural differences controlled by passed lpaAppealType and optional context flags.
// Mirrors the generic questionnaire flow pattern while keeping HAS-specific steps that differ from S78.
export const householderQuestionnaire = (context, lpaManageAppealsData, lpaAppealType, caseRef = '') => {
	const basePage = new BasePage();
	const constraintsAndDesignations = new ConstraintsAndDesignations();
	const consultResponseAndRepresent = new ConsultResponseAndRepresent();
	const appealProcess = new AppealProcess();
	const siteAccess = new SiteAccess();
	const notifyParties = new NotifyParties();
	const poReportAndSupportDocs = new PoReportAndSupportDocs();

	let appealId = '';
	const targetAppealType = lpaAppealType || lpaManageAppealsData?.hasAppealType; // fallback
	const rowNumberOfAppealQuestionnaire = 0; // first matching row
	let rowCounter = 0;
	let linkFound = false;

	const selectAppealRow = () => {
		if (caseRef) {
			return cy.contains('a.govuk-link', caseRef)
				.should('be.visible')
				.then(() => {
					appealId = caseRef;
					// navigate into questionnaire if needed; return Cypress command to continue the chain
					return cy.contains('a.govuk-link', 'Submit questionnaire').click();
				});
		}
		return cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
			if (linkFound) return false;
			if ($row.find('th').length > 0) return; // skip header
			const $tds = $row.find('td');
			if ($tds.length < 6) return; // ensure expected columns
			const appealTypeText = $tds.eq(2).text().trim();
			const todoText = $tds.eq(5).text().trim();
			if (appealTypeText === targetAppealType && todoText.includes(lpaManageAppealsData?.todoQuestionnaire)) {
				if (rowCounter === rowNumberOfAppealQuestionnaire) {
					const $link = $tds.eq(5).find('a');
					if ($link.attr('href')?.includes(lpaManageAppealsData?.questionnaireLink)) {
						appealId = $link.attr('href')?.split('/').pop();
						$link[0].scrollIntoView();
						$link[0].click();
						linkFound = true;
						return false;
					}
				}
				rowCounter++;
			}
		});
	};

	selectAppealRow().then(() => {
		cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);
		// Verify appeal type shown matches expectation (Householder or provided type)
		cy.get(basePage?._selectors.dlgovukSummaryListAppealDetails).within(() => {
			cy.get(basePage?._selectors.govukSummaryListRow).each(($row) => {
				const $key = $row.find(basePage?._selectors.govukSummaryListKey);
				if ($key.text().trim() === lpaManageAppealsData?.appealType) {
					// Determine expected value: householder, or fallback, or passed type
					const expected = targetAppealType === lpaManageAppealsData?.hasAppealType
						? lpaManageAppealsData?.appealTypeHouseholder
						: (lpaManageAppealsData?.casPlanningAppealType || targetAppealType);
					cy.wrap($row)
						.find(basePage?._selectors.govukSummaryListValue)
						.invoke('text')
						.then((txt) => {
							const normalized = txt.replace(/\s+/g, ' ').trim();
							cy.log(`Verifying appeal type. Expected: "${expected}", Found: "${normalized}"`);
							expect(normalized).to.include(expected);
						});
					return false;
				}
			});
		});

		// Determine the correct "Is this the correct type" label.
		const correctTypeText = targetAppealType === lpaManageAppealsData?.casPlanningAppealType
			? lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealCASPlanning
			: lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealHouseHolder;	
		cy.contains(correctTypeText)
			.closest(basePage?._selectors.govukSummaryListRow)
			.find(basePage?._selectors.agovukLink)
			.then($link => {
				if ($link.text().includes(lpaManageAppealsData?.questionnaireAnswer)) {
					cy.wrap($link).contains(lpaManageAppealsData?.questionnaireAnswer).click();
				} else {
					cy.wrap($link).contains(lpaManageAppealsData?.questionnaireChange).click();
				}
			});

		// Constraints & designations subset needed for HAS / CAS
		constraintsAndDesignations.selectCorrectTypeOfAppeal(context);
		constraintsAndDesignations.selectAffectListedBuildings(context, lpaManageAppealsData);
		constraintsAndDesignations.selectConservationArea(context);
		constraintsAndDesignations.selectGreenBelt(context);

		// Notify & representations
		notifyParties.selectAndNotifyParties(context, lpaManageAppealsData);
		consultResponseAndRepresent.selectOtherPartyRepresentations(context);

		// Planning officer's report & supporting docs (plans step internally skipped for CAS if not householder) 
		poReportAndSupportDocs.selectPOReportAndSupportDocsHas(context, lpaManageAppealsData, targetAppealType);
		poReportAndSupportDocs.selectEmergingPlansHas(context);
		poReportAndSupportDocs.selectSupplementaryPlanningDocs(context);

		// Site access
		siteAccess.selectLpaSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectNeighbourSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectLpaSiteSafetyRisks(context, lpaManageAppealsData);

		// Appeals process
		appealProcess.selectNearbyAppeals(context, lpaManageAppealsData, lpaManageAppealsData?.hasAppealType);
		appealProcess.selectNewConditions(context, lpaManageAppealsData);

		// Submit
		cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
		cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
		cy.get('a[data-cy="Feedback-Page-Body"]').first().click();
		waitingForReview(appealId);
	});
};
