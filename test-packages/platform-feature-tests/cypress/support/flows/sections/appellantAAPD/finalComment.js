/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { FinalComment } from "../../pages/appellant-aapd/finalComment";

export const finalComment = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.toLowerCase().includes(appealType.toLowerCase()) && rowtext.includes(prepareAppealData?.todoFinalComments)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(prepareAppealData?.finalCommentsLink)) {
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
		cy.advanceToNextPage();
		finalComment.selectSubmitAnyFinalComment(context);
	});
	//commented for test during coding
	cy.contains('button', prepareAppealData?.submitFinalComments).click();
	//cy.get(basePage?._selectors.govukPanelTitle).contains(prepareAppealData?.finalCommentsSubmitted);
};
export const finalCommnetForCaseRef = (context, appealId) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();	
	//cy.url().should('include', `/manage-appeals/appeal-statement/${appealId}/appeal-statement`);
	cy.get(`a[href*="/appeals/final-comments/${appealId}/entry"]`).click();
	cy.advanceToNextPage();
	finalComment.selectSubmitAnyFinalComment(context);

	// commented for test during coding
	cy.get('.govuk-button').contains('Submit final comments').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Final comments submitted');
};