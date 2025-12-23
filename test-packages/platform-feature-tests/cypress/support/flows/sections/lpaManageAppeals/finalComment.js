/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { FinalComment } from "../../pages/lpa-manage-appeals/lpa-final-comment/finalComment";

export const finalComment = (context, lpaManageAppealsData, appealType) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();	
	let counter = 0;
	let appealId;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(appealType) && rowtext.includes(lpaManageAppealsData?.todoFinalcomment)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(lpaManageAppealsData?.appealFinalcommentsLink)) {
							const parts = $link.attr('href')?.split('/');
							appealId = parts[parts.length - 1];
							cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
							return false;
						}
					});
				});
			}
			counter++;
		}
	}).then(() => {
		finalComment.selectSubmitAnyFinalComment(context);
	});	
	cy.get('.govuk-button').contains('Submit final comments').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Final comments submitted');
};

export const finalCommnetForCaseRef = (context, appealId) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();	
	cy.get(`a[href*="/manage-appeals/final-comments/${appealId}/entry"]`).click();
	cy.advanceToNextPage();
	finalComment.selectSubmitAnyFinalComment(context);

	// commented for test during coding
	cy.get('.govuk-button').contains('Submit final comments').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Final comments submitted');
};