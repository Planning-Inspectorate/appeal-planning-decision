/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { ProofsOfEvidence } from "../../pages/rule-6-appeals/r6FullAppealsProofsOfEvidence";


export const r6FullAppealsProofsOfEvidence = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const proofsOfEvidence = new ProofsOfEvidence();	
	let appealId;
	let counter = 0;
	cy.get(`#to-do .govuk-table ${basePage?._selectors.trgovukTableRow}`).each(($row) => {
		const rowtext = $row.text();
		cy.log("Test POC r6",rowtext);		
			if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.rule6todoProofOfEvidence)) {
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
		cy.url().should('include', `/rule-6/proof-evidence/${appealId}`);		
		proofsOfEvidence.selectUploadProofEvidence(context);
		proofsOfEvidence.selectAddWitnesses(context);		
	});
	// commented for test during coding
	// 	cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};
