/// <reference types="cypress"/>

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../page-objects/base-page";

export const appealIdWaitingForReview = () => {
    const basePage = new BasePage();
    cy.get('#tab_waiting-for-review').click();
    //cy.get(basePage?._selectors.trgovukTableRow).should('exist');    
    // return cy.get('table tr').last().find('td').eq(0).invoke('text').then((text) => {
    //     const appealId = text.trim();
    //     Cypress.log({ name: 'Appeal ID', message: appealId });
    //     return cy.wrap(appealId); // Return the appeal ID for further use
    // });
    // return "6018323";
    return cy.wrap(6018750);
}