// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class HealthSafetyIssuesPage {

    _selectors = {
        appellantSiteSafetyAppellantSiteSafetyDetails: '#appellantSiteSafety_appellantSiteSafetyDetails'
    }

    addHealthSafetyIssuesData(context, prepareAppealData) {
        const basePage = new BasePage();

        if (context?.applicationForm?.isAppellantSiteSafety) {
            cy.getByData(basePage?._selectors.answerYes).click();
            basePage.addTextField(this._selectors?.appellantSiteSafetyAppellantSiteSafetyDetails, prepareAppealData?.appellantSiteSafetyDetails);
            cy.advanceToNextPage();
        }
        else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}