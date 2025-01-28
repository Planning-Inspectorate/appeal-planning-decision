/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { AppellantFullApeealProofsOfEvidence } from "../../pages/appellant-aapd/appellant-proofs-of-evidence/appellantFullApeealProofsOfEvidence";

export const appellantFullApeealProofsOfEvidence = (context, prepareAppealData) => {
	const basePage = new BasePage();
	const appellantFullApeealProofsOfEvidence = new AppellantFullApeealProofsOfEvidence();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(prepareAppealData?.s78AppealType) && rowtext.includes(prepareAppealData?.todoProofsOfEvidence)) {
			if (counter === 0) {				
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.s78AppealType).should('be.visible');					
					cy.get('a').each(($link) => {						
						if ($link.attr('href')?.includes(prepareAppealData?.proofsOfEvidenceLink)) {
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
		cy.url().should('include', `/manage-appeals/proof-evidence/${appealId}`);
		appellantFullApeealProofsOfEvidence.selectUploadProofEvidence(context);
		appellantFullApeealProofsOfEvidence.selectAddWitnesses(context);
	});
	// commented for test during coding
	// 	cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};