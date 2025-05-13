/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { FinalComment } from "../../pages/representations/finalComment";

export const finalComment = (context, prepareAppealData) => {
	const basePage = new BasePage();
	const finalComment = new FinalComment();	
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(prepareAppealData?.FullAppealType) && rowtext.includes(prepareAppealData?.todoFinalComments)) {
			if (counter === 0) {				
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.FullAppealType).should('be.visible');					
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
		cy.get('body').then(($body) => {
			cy.log($body.find('a.govuk-link:contains("Submit final comments")'))
			if ($body.find('a.govuk-link:contains("Submit final comments")').length > 0) {
				cy.contains('Submit final comments').click();
			}			
		})
		finalComment.selectSubmitAnyFinalComment(context);
	});
	//commented for test during coding
		// cy.contains('button',prepareAppealData?.submitFinalComments).click();
		// cy.get(basePage?._selectors.govukPanelTitle).contains(prepareAppealData?.finalCommentsSubmitted);
};