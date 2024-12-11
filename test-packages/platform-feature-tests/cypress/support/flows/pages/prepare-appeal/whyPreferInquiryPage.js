// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class WhyPreferInquiryPage {

    _selectors = {
        appellantPreferInquiryDetails: '#appellantPreferInquiryDetails'
    }

    addWhyPreferInquiryData() {
        const basePage = new BasePage();

        //Why would you prefer a inquiry?
        basePage.addTextField(this._selectors?.appellantPreferInquiryDetails, 'Previous decision is not correct 12345!£%^&*');
        cy.advanceToNextPage();
    };
}