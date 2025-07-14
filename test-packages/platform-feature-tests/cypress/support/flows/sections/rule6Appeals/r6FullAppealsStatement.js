/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { R6FullAppealsStatement } from "../../pages/rule-6-appeals/r6FullAppealsStatement";


export const r6FullAppealsStatement = (context, lpaManageAppealsData) => {
	const basePage = new BasePage();
	const statement = new R6FullAppealsStatement();
	let appealId;
	let counter = 0;
	cy.get(`#to-do .govuk-table ${basePage?._selectors.trgovukTableRow}`).each(($row) => {
		const rowtext = $row.text();
		if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.rule6todoStatement)) {
			if (counter === 0) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes(lpaManageAppealsData?.statementLink)) {
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
		cy.url().should('include', `/rule-6/appeal-statement/${appealId}/appeal-statement`);
		cy.get('#rule6Statement').type('Statement for full appleal');
		cy.advanceToNextPage();
		statement.selectAddWitnesses(context);
	});
	// commented for test during coding

	cy.get('.govuk-button').contains('Submit appeal statement').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Appeal statement submitted');
};
