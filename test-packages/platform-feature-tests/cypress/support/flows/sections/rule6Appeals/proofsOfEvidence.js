/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { ProofsOfEvidence } from "../../pages/rule-6-appeals/proofsOfEvidence";
export const proofsOfEvidence = (context, lpaManageAppealsData, appealType) => {
	const basePage = new BasePage();
	const proofsOfEvidence = new ProofsOfEvidence();	
	let appealId;
	let counter = 0;
	cy.get(`#to-do .govuk-table ${basePage?._selectors.trgovukTableRow}`).each(($row) => {
		const rowtext = $row.text();
		cy.log("Test POC r6",rowtext);		
			if (rowtext.includes(appealType) && rowtext.includes(lpaManageAppealsData?.rule6todoProofOfEvidence)) {
			if (counter === 0) {							
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');					
					cy.get('a').each(($link) => {					
						if ($link.attr('href')?.includes(lpaManageAppealsData?.proofsOfEvidenceLink)) {							
							const parts = $link.attr('href')?.split('/');
							appealId = parts?.[parts.length - 2];														
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
		cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
		cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};
