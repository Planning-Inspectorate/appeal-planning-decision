/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { ProofsOfEvidence } from "../../pages/lpa-manage-appeals/lpa-proofs-of-evidence/proofsOfEvidence";

export const fullAppealProofsOfEvidence = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const proofsOfEvidence = new ProofsOfEvidence();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.lpaTodoProofsOfEvidence)) {
			if (counter === 1) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
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
		cy.url().should('include', `/manage-appeals/proof-evidence/${appealId}`);
		proofsOfEvidence.selectUploadProofEvidence(context);
		proofsOfEvidence.selectAddWitnesses(context);
	});
	// commented for test during coding
	// 	cy.getByData(lpaManageAppealsData?.submitQuestionnaire).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};