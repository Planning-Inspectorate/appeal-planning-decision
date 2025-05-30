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
import { waitingForReview} from "../../pages/lpa-manage-appeals/waitingForReview";

export const fullAppealQuestionnaire = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const constraintsAndDesignations = new ConstraintsAndDesignations();
	const envImpactAssess = new EnvImpactAssess();
	const consultResponseAndRepresent = new ConsultResponseAndRepresent();
	const appealProcess = new AppealProcess();
	const siteAccess = new SiteAccess();
	const notifyParties = new NotifyParties();
	const poReportAndSupportDocs = new PoReportAndSupportDocs();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoQuestionnaire)) {
			if (counter === 1) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
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
	}).then(() => {

		cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);
		cy.get(basePage?._selectors.dlgovukSummaryListAppealDetails).within(() => {
			cy.get(basePage?._selectors.govukSummaryListRow).each(($row) => {
				const $key = $row.find(basePage?._selectors.govukSummaryListKey);
				if ($key.text().trim() === lpaManageAppealsData?.appealType) {
					cy.wrap($row).find(basePage?._selectors.govukSummaryListValue).should('contain.text', lpaManageAppealsData?.appealTypeFullPlanning);
					return false;
				}
			});
		});
		cy.contains(lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppealFullPlanning).closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.agovukLink).then($link => {
			if ($link.text().includes(lpaManageAppealsData?.questionnaireAnswer)) {
				cy.wrap($link).contains(lpaManageAppealsData?.questionnaireAnswer).click();
			} else {
				cy.wrap($link).contains(lpaManageAppealsData?.questionnaireChange).click();
			}
		});
		constraintsAndDesignations.selectCorrectTypeOfAppeal(context);
		constraintsAndDesignations.selectChangesListedBuilding(context, lpaManageAppealsData);
		constraintsAndDesignations.selectAffectListedBuildings(context, lpaManageAppealsData);
		constraintsAndDesignations.selectAffectScheduledMonument(context);
		constraintsAndDesignations.selectConservationArea(context);
		constraintsAndDesignations.selectProtectedSpecies(context);
		constraintsAndDesignations.selectGreenBelt(context);
		constraintsAndDesignations.selectAreaOfOutstandingNaturalBeauty(context, lpaManageAppealsData);
		constraintsAndDesignations.selectTreePreservationOrder(context);
		constraintsAndDesignations.selectGypsyTraveller(context);
		constraintsAndDesignations.selectPublicRightOfWay(context);
		envImpactAssess.selectScheduleType(context, lpaManageAppealsData);
		notifyParties.selectAndNotifyParties(context, lpaManageAppealsData);
		consultResponseAndRepresent.selectStatutoryConsultees(context, lpaManageAppealsData);
		consultResponseAndRepresent.selectConsultationResponses(context);
		consultResponseAndRepresent.selectOtherPartyRepresentations(context);
		//Planning officer's report and supplementary documents
		poReportAndSupportDocs.selectPOReportAndSupportDocsS78(context);
		poReportAndSupportDocs.selectStatuorydevelopmentplan(context);
		poReportAndSupportDocs.selectEmergingPlansS78(context);
		poReportAndSupportDocs.selectOtherRelevantPolicies(context);
		poReportAndSupportDocs.selectSupplementaryPlanningDocs(context);
		poReportAndSupportDocs.selectCommunityInfraLevy(context);
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
