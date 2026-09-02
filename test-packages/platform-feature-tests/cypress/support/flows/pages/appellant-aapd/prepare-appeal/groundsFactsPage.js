// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../../page-objects/prepare-appeal/prepare-appeal-selector";

export class GroundsFactsPage {

    /**
     * Fills in the "Facts for ground (x)" and supporting documents questions
     * for every ground that was selected on the "choose-grounds" page.
     */
    addGroundsFactsData(selectedGrounds, context, prepareAppealData) {
        const basePage = new BasePage();
        const prepareAppealSelector = new PrepareAppealSelector();
        const prepareAppealUrl = prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal;
        const allGrounds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

        allGrounds.forEach((ground) => {
            if (!selectedGrounds.includes(ground)) {
                return;
            }

            // Facts textarea for this ground
            cy.validateURL(`${prepareAppealUrl}/facts-ground-${ground}`);
            cy.get(`#facts-${ground}`).type(prepareAppealData?.groundsFacts?.[ground] ?? `Facts for ground ${ground} test text`);
            cy.advanceToNextPage();

            // Do you have any documents to support your ground ([x]) facts?
            cy.validateURL(`${prepareAppealUrl}/facts-ground-${ground}-supporting-documents`);
            if (context?.applicationForm?.groundsSupportingDocuments?.[ground]) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectory(context?.documents?.["uploadGroundSupportingDoc_" + ground] ?? context?.documents?.uploadOtherNewSupportDoc);
            } else {
                cy.getByData(basePage?._selectors.answerNo).click();
            }
            cy.advanceToNextPage();
        });
    };
}
