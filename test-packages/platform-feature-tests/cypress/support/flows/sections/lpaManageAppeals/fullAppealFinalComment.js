/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { Statement } from "../../pages/lpa-manage-appeals/lpa-statement/statement";

export const fullAppealFinalComment = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const statement = new Statement();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoFinalcomment)) {
			if (counter === 0) {				
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
					cy.get('a').each(($link) => {						
						if ($link.attr('href')?.includes(lpaManageAppealsData?.appealFinalcommentsLink)) {
							const parts = $link.attr('href')?.split('/');
							appealId = parts[parts.length - 2];					
							cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
							return false;
						}
					});
				});
			}
			counter++;
		}
	}).then(() => {
		cy.url().should('include', `/manage-appeals/final-comments/${appealId}/submit-final-comments`);
		statement.addStatement(context);
		statement.haveAdditionalDocumentforStatement(context);
	});	
	// commented for test during coding
	// 	cy.getByData(lpaManageAppealsData?.submitAppealStatement).click();
	// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaManageAppealsData?.questionnaireSubmitted);
};