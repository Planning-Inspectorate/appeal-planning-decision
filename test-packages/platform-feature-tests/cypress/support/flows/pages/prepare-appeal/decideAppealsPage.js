// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class DecideAppealsPage {

    _selectors = {
        procedurePreferenceWritten: '[data-cy="answer-written"]',
        procedurePreferenceHearing: '[data-cy="answer-hearing"]',
        procedurePreferenceInquiry: '[data-cy="answer-inquiry"]',
        appellantpreferHearingDetails: '#appellantPreferHearingDetails',
        appellantpreferInquiryDetails: '#appellantPreferInquiryDetails',
        appellantpreferInquiryDuration: '#appellantPreferInquiryDuration',
        appellantpreferInquiryWitnesses: '#appellantPreferInquiryWitnesses'
    }

    addDecideAppealsData(appellantProcedurePreference) {
        const basePage = new BasePage();

        if (appellantProcedurePreference === 'written') {
            basePage.clickRadioBtn(this._selectors.procedurePreferenceWritten);
            cy.advanceToNextPage();
        } else {
            if (appellantProcedurePreference === 'hearing') {
                basePage.clickRadioBtn(this._selectors.procedurePreferenceHearing);
                cy.advanceToNextPage();
                basePage.addTextField(this._selectors.appellantpreferHearingDetails, 'Test why prefer hearing testproperty123456789aAbcdEF!"£$%QA');
                cy.advanceToNextPage();
            } else if (appellantProcedurePreference === 'inquiry') {
                basePage.clickRadioBtn(this._selectors.procedurePreferenceInquiry);
                cy.advanceToNextPage();
                basePage.addTextField(this._selectors.appellantpreferInquiryDetails, 'Test why prefer inquiry testproperewrwe5454354rty12345dfdfder6789aAbcdEF!"£$%QA');
                cy.advanceToNextPage();
                basePage.addTextField(this._selectors.appellantpreferInquiryDuration, '50');
                cy.advanceToNextPage();
                basePage.addTextField(this._selectors.appellantpreferInquiryWitnesses, '10');
                cy.advanceToNextPage();
            }
        }
    };
}