/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { AppealProcess } from "../../pages/lpa-manage-appeals/appealProcess";
import { ProofsOfEvidence } from "../../pages/lpa-manage-appeals/lpa-proofs-of-evidence/proofsOfEvidence";
import { ConstraintsAndDesignations } from "../../pages/lpa-manage-appeals/constraintsAndDesignations";
import { EnvImpactAssess } from "../../pages/lpa-manage-appeals/envImpactAssess";
import { ConsultResponseAndRepresent } from "../../pages/lpa-manage-appeals/consultResponseAndRepresent";
import { NotifyParties } from "../../pages/lpa-manage-appeals/notifyParties";
import { PoReportAndSupportDocs } from "../../pages/lpa-manage-appeals/poReportAndSupportDocs";
import { SiteAccess } from "../../pages/lpa-manage-appeals/siteAccess";

export const fullAppealProofsOfEvidence = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const proofsOfEvidence = new ProofsOfEvidence();
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
			if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoProofsOfEvidence)) {
			if (counter === 0) {
				cy.log("Test POC",rowtext);			
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
					cy.log("Test Rows",$row);
					cy.get('a').each(($link) => {
					cy.log("Test Link",$link.attr('href'));
						if ($link.attr('href')?.includes(lpaManageAppealsData?.proofsOfEvidenceLink)) {
							appealId = $link.attr('href')?.split('/').pop();
							cy.log("Validate Link",appealId,$link);							
							cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
							return false;
						}
					});
				});
			}
			counter++;
		}
	}).then(() => {
		cy.url().should('include', `/manage-appeals/proof-evidence/${appealId}`);		
		proofsOfEvidence.selectUploadProofEvidence(context);
		proofsOfEvidence.selectAddWitnesses(context);
		
	});
	// commented for test during coding
	// 	cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};
