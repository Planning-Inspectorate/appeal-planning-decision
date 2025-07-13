/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { ProofsOfEvidence } from "../../pages/appellant-aapd/proofsOfEvidence";
export const proofsOfEvidence = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	const proofsOfEvidence = new ProofsOfEvidence();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(appealType) && rowtext.includes(prepareAppealData?.todoProofsOfEvidence)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');
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
		proofsOfEvidence.selectUploadProofEvidence(context);
		proofsOfEvidence.selectAddWitnesses(context);
	});
	// commented for test during coding due to seeded data
	// 	cy.getByData(prepareAppealData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(prepareAppealData?.questionnaireSubmitted);
};