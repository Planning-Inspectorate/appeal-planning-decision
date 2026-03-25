/* eslint-disable cypress/unsafe-to-chain-command */
import { BasePage } from "../../../../page-objects/base-page";
import { Statement } from "../../pages/appellant-aapd/statement";

const rowNumberOfAppealStatement = 0;

export const selectRowAppealStatementCounter = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	let rowCounter = 0;
	let linkFound = false;
	return cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
		if (linkFound) return false;
		if ($row.find("th").length > 0) {
			return;
		}
		return Cypress.Promise.resolve().then(() => {
			const $tds = $row.find("td");
			const todoText = $tds.eq(4).text().trim();
			const appealTypeText = $tds.eq(2).text().trim();			
			if (appealTypeText === appealType && todoText.includes(prepareAppealData?.todoStatement)) {
				if (rowCounter === rowNumberOfAppealStatement) {
					const $link = $tds.eq(4).find("a");
						$link[0].scrollIntoView();
						$link[0].click();
						linkFound = true;
						return false;
				}
				rowCounter++;
			}
		});
	});
};

export const statement = (context, prepareAppealData, appealType) => {
	const basePage = new BasePage();
	const statement = new Statement();
	selectRowAppealStatementCounter(context, prepareAppealData, appealType).then(() => {
		cy.advanceToNextPage();
		statement.addStatement(context);
		statement.haveAdditionalDocumentforStatement(context);
		cy.get(".govuk-button").contains("Submit appeal statement").click();
		cy.get(basePage?._selectors.govukPanelTitle).contains("Appeal statement submitted");
	});
};