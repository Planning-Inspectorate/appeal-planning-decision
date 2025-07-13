// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class WhyPreferHearingPage {

    _selectors = {
        appellantPreferHearingDetails: '#appellantPreferHearingDetails'
    }

    addWhyPreferHearingData() {
        const basePage = new BasePage();

        //Why would you prefer a hearing?
        basePage.addTextField(this._selectors?.appellantPreferHearingDetails, 'To Argue in the court12345!£%^&*');
        cy.advanceToNextPage();
    };
}