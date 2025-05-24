/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { FinalComment } from "../../pages/lpa-manage-appeals/lpa-final-comment/finalComment";

export const fullAppealFinalComment = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoFinalcomment)) {
			if (counter === 3) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
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
	//commented for test during coding
	cy.get('.govuk-button').contains('Submit final comments').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Final comments submitted');
};