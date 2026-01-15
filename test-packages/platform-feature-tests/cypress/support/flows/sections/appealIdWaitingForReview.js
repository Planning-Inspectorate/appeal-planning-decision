/// <reference types="cypress"/>

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../page-objects/base-page";

export const appealIdWaitingForReview = () => {
    const basePage = new BasePage();
    cy.get('#tab_waiting-for-review').click();
    cy.wait(10000);
    cy.reload();
    cy.get(basePage?._selectors.trgovukTableRow).should('exist');    
    // Grab both the first (eq(0)) and third (eq(2)) TD values from the last table row
    return cy.get('table tr').last().find('td').then(($tds) => {
        const firstTdText = $tds.eq(0).text().trim();
        const thirdTdText = $tds.eq(2).text().trim();

        Cypress.log({ name: 'TD[0]', message: firstTdText });
        Cypress.log({ name: 'TD[2]', message: thirdTdText });

        // Return both values so they can be used by the caller
        return cy.wrap({ caseRef: String(firstTdText), appealType: thirdTdText });
    });
}