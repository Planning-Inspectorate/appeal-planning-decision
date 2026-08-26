/// <reference types="cypress"/>

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../page-objects/base-page";

export const appealIdWaitingForReview = () => {
    const basePage = new BasePage();
    const correlationId = Cypress.env('correlationId');
    const maxAttempts = 15;
    const retryDelayMs = 3000;

    cy.get('#tab_waiting-for-review').click();

    // Poll instead of a single fixed wait to avoid pipeline timeouts when the row appears late.
    // Each recursive call is returned so callers can chain off completion of the full retry loop.
    const waitForCaseRow = (attempt = 1) => {
        cy.wait(retryDelayMs);
        cy.reload();
        return cy.get('body').then(($body) => {
            const rowFound = correlationId
                ? $body.find(`table tr:contains("${correlationId}")`).length > 0
                : $body.find(basePage?._selectors.trgovukTableRow).length > 0;

            if (!rowFound && attempt < maxAttempts) {
                return waitForCaseRow(attempt + 1);
            }
            return cy.wrap(rowFound);
        });
    };

    return waitForCaseRow().then(() => {
        cy.get(basePage?._selectors.trgovukTableRow, { timeout: retryDelayMs * maxAttempts }).should('exist');
        // Prefer the row that contains our correlation ID; fallback to last row
        const rowChain = correlationId
            ? cy.contains('table tr', correlationId).last()
            : cy.get('table tr').last();

        // Grab both the first (eq(0)) and third (eq(2)) TD values from the matched row
        return rowChain.find('td').then(($tds) => {
            const firstTdText = $tds.eq(0).text().trim();
            const thirdTdText = $tds.eq(2).text().trim();

            Cypress.log({ name: 'TD[0]', message: firstTdText });
            Cypress.log({ name: 'TD[2]', message: thirdTdText });

            // Return both values so they can be used by the caller
            return cy.wrap({ caseRef: String(firstTdText), appealType: thirdTdText });
        });
    });
}