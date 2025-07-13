/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { Statement } from "../../pages/representations/statement";

export const statement = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	const statement = new Statement();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(appealType) && rowtext.includes(prepareAppealData?.todoStatement)) {
			if (counter === 3) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(prepareAppealData?.appealStatementLink)) {
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
		cy.url().should('include', `/appeals/appeal-statement/${appealId}/appeal-statement`);
		statement.addStatement(context);
		statement.haveAdditionalDocumentforStatement(context);
	});
	// commented for test during coding
	cy.get('.govuk-button').contains('Submit appeal statement').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Appeal statement submitted');
};