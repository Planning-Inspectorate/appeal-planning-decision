/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { AppellantFullApealProofsOfEvidence } from "../../pages/appellant-aapd/appellant-proofs-of-evidence/appellantFullApealProofsOfEvidence";

export const appellantFullAppealProofsOfEvidence = (context, prepareAppealData) => {
	const basePage = new BasePage();
	const appellantFullApealProofsOfEvidence = new AppellantFullApealProofsOfEvidence();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(prepareAppealData?.FullAppealType) && rowtext.includes(prepareAppealData?.todoProofsOfEvidence)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.FullAppealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(prepareAppealData?.proofsOfEvidenceLink)) {							
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
		cy.url().should('include', `/appeals/proof-evidence/${appealId}`);
		appellantFullApealProofsOfEvidence.selectUploadProofEvidence(context);
		appellantFullApealProofsOfEvidence.selectAddWitnesses(context);
	});
	// commented for test during coding due to seeded data
	// 	cy.getByData(prepareAppealData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(prepareAppealData?.questionnaireSubmitted);
};