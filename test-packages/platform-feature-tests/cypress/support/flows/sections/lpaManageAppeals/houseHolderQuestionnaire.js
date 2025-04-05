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

export const householderQuestionnaire = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const constraintsAndDesignations = new ConstraintsAndDesignations();
	const consultResponseAndRepresent = new ConsultResponseAndRepresent();
	const appealProcess = new AppealProcess();
	const siteAccess = new SiteAccess();
	const notifyParties = new NotifyParties();
	const poReportAndSupportDocs = new PoReportAndSupportDocs();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.hasAppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.hasAppealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
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
					cy.wrap($row).find(basePage?._selectors.govukSummaryListValue).should('contain.text', lpaManageAppealsData?.appealTypeHouseholder);
					return false;
				}
			});
		});
		cy.contains(lpaManageAppealsData?.constraintsAndDesignations?.correctTypeOfAppeal).closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.agovukLink).then($link => {
			if ($link.text().includes(lpaManageAppealsData?.questionnaireAnswer)) {
				cy.wrap($link).contains(lpaManageAppealsData?.questionnaireAnswer).click();
			} else {
				cy.wrap($link).contains(lpaManageAppealsData?.questionnaireChange).click();
			}
		});
		constraintsAndDesignations.selectCorrectTypeOfAppeal(context);
		constraintsAndDesignations.selectAffectListedBuildings(context, lpaManageAppealsData);
		constraintsAndDesignations.selectConservationArea(context);
		constraintsAndDesignations.selectGreenBelt(context);
		notifyParties.selectAndNotifyParties(context, lpaManageAppealsData);
		consultResponseAndRepresent.selectOtherPartyRepresentations(context);
		//Planning officer's report and supplementary documents
		poReportAndSupportDocs.selectPOReportAndSupportDocsHas(context);
		poReportAndSupportDocs.selectEmergingPlansHas(context);
		poReportAndSupportDocs.selectSupplementaryPlanningDocs(context);

		//Site access
		siteAccess.selectLpaSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectNeighbourSiteAccess(context, lpaManageAppealsData);
		siteAccess.selectLpaSiteSafetyRisks(context, lpaManageAppealsData);
		// Appeals Access
		appealProcess.selectNearbyAppeals(context, lpaManageAppealsData, lpaManageAppealsData?.hasAppealType);
		appealProcess.selectNewConditions(context, lpaManageAppealsData);
	});
	//commented for test during coding
	// cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
	// cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};
