/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
import { Statement } from "../../pages/appellant-aapd/statement";

const rowNumberOfAppealInStatement = 0;
export const statement = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	const statement = new Statement();
	let appealId;
	let rowCounter = 0;
	let statementLinkClicked = false;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		const rowtext = $row.text();
		if (
			rowtext.toLowerCase().includes(appealType.toLowerCase()) &&
			rowtext.toLowerCase().includes((prepareAppealData?.todoStatement || '').toLowerCase())
		) {
			if (rowCounter === rowNumberOfAppealInStatement) {
				cy.wrap($row).within(() => {
					cy.get(basePage?._selectors.trgovukTableCell).contains(appealType).should('be.visible');
					cy.get('a').each(($link) => {
						if ($link.attr('href')?.includes('statement')) {
							appealId = $link.attr('href')?.split('/').pop();
							cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
							statementLinkClicked = true;
							return false;
						}
					});
				});
			}
			rowCounter++;
		}
	}).then(() => {
		cy.advanceToNextPage();
		statement.addStatement(context);
		statement.haveAdditionalDocumentforStatement(context);
	});

	cy.get('.govuk-button').contains('Submit appeal statement').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Appeal statement submitted');
};

export const statementForCaseRef = (context, appealId) => {
	const basePage = new BasePage();
	const statement = new Statement();
	const normalizedAppealId = String(appealId).trim();

	cy.get('a').then(($links) => {
		const statementLink = [...$links].find((link) => {
			const href = link.getAttribute('href') || '';
			return (
				href.includes(`/appeals/statement/${normalizedAppealId}`) ||
				href.includes(`appeals/statement/${normalizedAppealId}`)
			);
		});

		expect(statementLink, `Statement link for appeal ${normalizedAppealId}`).to.exist;
		cy.wrap(statementLink).scrollIntoView().click({ force: true });
	});
	cy.url().then((url) => {
		if (
			url.includes(`/appeals/statement/${normalizedAppealId}/entry`) ||
			url.includes(`/appeals/statement/${normalizedAppealId}/statement`)
		) {
			cy.advanceToNextPage();
		}
	});
	statement.addStatement(context);
	statement.haveAdditionalDocumentforStatement(context);

	cy.get('.govuk-button').contains('Submit appeal statement').click();
	cy.get(basePage?._selectors.govukPanelTitle).contains('Appeal statement submitted');
};

export const appellantStatementForCaseRef = statementForCaseRef;
export const StatementForCaseRef = statementForCaseRef;