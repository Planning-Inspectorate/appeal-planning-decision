// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../../page-objects/prepare-appeal/prepare-appeal-selector";

export class ChooseGroundsPage {

    /**
     * Selects the given grounds of appeal and, when ground (a) is included, answers the
     * "retrospective planning application" and "paid the ground (a) fee" questions that
     * only appear for that ground.
     */
    addChooseGroundsData(grounds) {
        const basePage = new BasePage();
        const prepareAppealSelector = new PrepareAppealSelector();
        const prepareAppealUrl = prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal;

        grounds.forEach((ground) => {
            cy.getByData(`answer-${ground}`).click();
        });
        cy.advanceToNextPage();

        if (grounds.includes('a')) {
            // Did anyone submit a retrospective planning application?
            cy.validateURL(`${prepareAppealUrl}/submit-planning-application`);
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();

            // Did you pay the ground (a) fee?
            cy.validateURL(`${prepareAppealUrl}/pay-ground-a`);
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
