/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { AppealProcess } from "../../pages/lpa-manage-appeals/appealProcess";
import { ConstraintsAndDesignations } from "../../pages/lpa-manage-appeals/constraintsAndDesignations";
import { EnvImpactAssess } from "../../pages/lpa-manage-appeals/envImpactAssess";
import { ConsultResponseAndRepresent } from "../../pages/lpa-manage-appeals/consultResponseAndRepresent";
import { NotifyParties } from "../../pages/lpa-manage-appeals/notifyParties";
import { PoReportAndSupportDocs } from "../../pages/lpa-manage-appeals/poReportAndSupportDocs";
import { SiteAccess } from "../../pages/lpa-manage-appeals/siteAccess";
import { waitingForReview } from "../../pages/lpa-manage-appeals/waitingForReview";


let appealId = '';
const rowNumberOfAppealQuestionnaire = 1;
export const selectRowAppealQuestionnaireCounter = (context, lpaManageAppealsData, lpaAppealType) => {
	const basePage = new BasePage();
	let rowCounter = 0;
	let linkFound = false;
	return cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		if (linkFound) return false;
		if ($row.find('th').length > 0) {
			return;
		}
		if (linkFound) return false;
		return Cypress.Promise.resolve().then(() => {
			const $tds = $row.find('td');
			const todoText = $tds.eq(5).text().trim();
			const appealType = $tds.eq(2).text().trim();
			cy.log(`Appeal Type: ${appealType}, Todo Text: ${todoText}, Lpa Appeal Type: ${lpaAppealType}`);
			if ((appealType === lpaAppealType) && todoText.includes(lpaManageAppealsData?.todoQuestionnaire)) {
				if (rowCounter === rowNumberOfAppealQuestionnaire) {

					const $link = $tds.eq(5).find('a')
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
		})
	})
};

export const selectAppealRowUsingCaseRef = (appealId) => {

	return cy.contains('a.govuk-link', appealId).should('be.visible');
}

export const selectAppealIdFromTable = (context, lpaManageAppealsData, lpaAppealType, caseRef) => {
	if (caseRef) {
		return selectAppealRowUsingCaseRef(caseRef);
	} else {
		return selectRowAppealQuestionnaireCounter(context, lpaManageAppealsData, lpaAppealType);
	}
}

export const questionnaire = (context, lpaManageAppealsData, lpaAppealType, caseRef = '') => {
	const basePage = new BasePage();
	const constraintsAndDesignations = new ConstraintsAndDesignations();
	const envImpactAssess = new EnvImpactAssess();
	const consultResponseAndRepresent = new ConsultResponseAndRepresent();
	const appealProcess = new AppealProcess();
	const siteAccess = new SiteAccess();
	const notifyParties = new NotifyParties();
	const poReportAndSupportDocs = new PoReportAndSupportDocs();
	selectAppealIdFromTable(context, lpaManageAppealsData, lpaAppealType, caseRef).then(($link) => {
		cy.log('Link found:', $link.text());
		if (caseRef) {
			appealId = caseRef;
			cy.contains('a.govuk-link', 'Submit questionnaire').click();
		}

		cy.get(basePage?._selectors.dlgovukSummaryListAppealDetails).within(() => {
			cy.get(basePage?._selectors.govukSummaryListRow).each(($row) => {
				const $key = $row.find(basePage?._selectors.govukSummaryListKey);
				if ($key.text().trim() === lpaManageAppealsData?.appealType) {
					let expectedText;
					if (lpaAppealType === lpaManageAppealsData?.s20AppealType) {
						expectedText = lpaManageAppealsData?.appealTypeListedBuilding;
					} else if (lpaAppealType === lpaManageAppealsData?.commercialadvAppealType) {
						expectedText = lpaManageAppealsData?.appealTypeCommercialAdvert;
					} else if (lpaAppealType === lpaManageAppealsData?.advertAppealType) {
						expectedText = lpaManageAppealsData?.appealTypeAdvert;
					} else {
						expectedText = lpaManageAppealsData?.appealTypeFullPlanning;
					}
					cy.wrap($row)
						.find(basePage?._selectors.govukSummaryListValue)
						.invoke('text')
						.then((txt) => {
							const normalized = txt.replace(/\s+/g, ' ').trim();
							expect(normalized).to.include(expectedText);
						});
					return false;
				}
			});
		});

		const correctTypeText = lpaAppealType === lpaManageAppealsData?.s20AppealType
			? lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealListedBuilding
			: lpaAppealType === lpaManageAppealsData?.commercialadvAppealType
				? lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealCommercialAdvertisement
				: lpaAppealType === lpaManageAppealsData?.advertAppealType
					? lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealAdvertisement
					: lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealFullPlanning;

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
		constraintsAndDesignations.selectCorrectTypeOfAppeal(context);
		if (lpaAppealType !== lpaManageAppealsData?.commercialadvAppealType) {
			constraintsAndDesignations.selectChangesListedBuilding(context, lpaManageAppealsData);
		}
		constraintsAndDesignations.selectAffectListedBuildings(context, lpaManageAppealsData);
		if (lpaAppealType === lpaManageAppealsData?.s20AppealType) {
			constraintsAndDesignations.selectPreserverGrantLoan(context);
			constraintsAndDesignations.selectConsultHistoricEngland(context);
		}
		constraintsAndDesignations.selectAffectScheduledMonument(context);
		constraintsAndDesignations.selectConservationArea(context);
		constraintsAndDesignations.selectProtectedSpecies(context);
		if (lpaAppealType === lpaManageAppealsData?.commercialadvAppealType || lpaAppealType === lpaManageAppealsData?.advertAppealType) {
			constraintsAndDesignations.selectSpecialControlAdvertisement(context);
		}
		constraintsAndDesignations.selectGreenBelt(context);
		constraintsAndDesignations.selectAreaOfOutstandingNaturalBeauty(context, lpaManageAppealsData);
		cy.log('lpaAppealType:', lpaAppealType);
		cy.log('s20AppealType:', lpaManageAppealsData?.s20AppealType);
		cy.log('s78AppealType:', lpaManageAppealsData?.s78AppealType);
		cy.log('commercialadvAppealType:', lpaManageAppealsData?.commercialadvAppealType);
		cy.log('advertAppealType:', lpaManageAppealsData?.advertAppealType);
		cy.log('context:', JSON.stringify(context));
		if (lpaAppealType === lpaManageAppealsData?.s20AppealType || lpaAppealType === lpaManageAppealsData?.s78AppealType) {
			constraintsAndDesignations.selectTreePreservationOrder(context);
			constraintsAndDesignations.selectGypsyTraveller(context);
			constraintsAndDesignations.selectPublicRightOfWay(context);
			envImpactAssess.selectScheduleType(context, lpaManageAppealsData);
		}
		notifyParties.selectAndNotifyParties(context, lpaManageAppealsData);
		consultResponseAndRepresent.selectStatutoryConsultees(context, lpaManageAppealsData);
		cy.log('lpaAppealType in questionnaire:', lpaAppealType);
		if (lpaAppealType === lpaManageAppealsData?.s20AppealType || lpaAppealType === lpaManageAppealsData?.s78AppealType) {
			consultResponseAndRepresent.selectConsultationResponses(context);
		}
		cy.log('lpaAppealType in questionnaire 2:', lpaAppealType);

		consultResponseAndRepresent.selectOtherPartyRepresentations(context);
		cy.log('lpaAppealType in questionnaire 3:', lpaAppealType);
		//Planning officer's report and supplementary documents
		poReportAndSupportDocs.selectPOReportAndSupportDocsS78(context);
		if (lpaAppealType === lpaManageAppealsData?.commercialadvAppealType || lpaAppealType === lpaManageAppealsData?.advertAppealType) {
			poReportAndSupportDocs.selectHighwaytraficPlans(context);
			poReportAndSupportDocs.selectPhotographsPlans(context);
		}
		poReportAndSupportDocs.selectStatuorydevelopmentplan(context);
		poReportAndSupportDocs.selectEmergingPlansS78(context);
		poReportAndSupportDocs.selectOtherRelevantPolicies(context);
		poReportAndSupportDocs.selectSupplementaryPlanningDocs(context);
		if (lpaAppealType === lpaManageAppealsData?.s20AppealType || lpaAppealType === lpaManageAppealsData?.s78AppealType) {
			poReportAndSupportDocs.selectCommunityInfraLevy(context);
		}

		//Site access
		siteAccess.selectLpaSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectNeighbourSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectLpaSiteSafetyRisks(context, lpaManageAppealsData);
		// Appeals Access
		appealProcess.selectProcedureType(context, lpaManageAppealsData);
		appealProcess.selectOngoingAppealsNextToSite(context, lpaManageAppealsData, lpaManageAppealsData?.s78AppealType);
		appealProcess.selectNewConditions(context, lpaManageAppealsData);
		// commented for test during coding
		cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
		cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
		cy.get('a[data-cy="Feedback-Page-Body"]').first().click();
		waitingForReview(appealId);
	});
};