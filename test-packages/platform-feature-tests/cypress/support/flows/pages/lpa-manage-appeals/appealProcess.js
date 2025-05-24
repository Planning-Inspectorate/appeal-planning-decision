// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
export class AppealProcess {

    _selectors = {
        nearbyAppealReference: '#nearbyAppealReference',
        newConditionsNewConditionDetails: '#newConditions_newConditionDetails',
        answerWritten: 'answer-written',
        answerHearing: 'answer-hearing',
        answerInquiry: 'answer-inquiry',
        lpaPreferHearingDetails: 'lpaPreferHearingDetails',
        lpaProcedurePreferenceLpaPreferInquiryDuration: 'lpaProcedurePreference_lpaPreferInquiryDuration',
        lpaPreferInquiryDetails: 'lpaPreferInquiryDetails'
    }
    selectProcedureType(context, lpaManageAppealsData) {
        if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.written) {
            cy.getByData(this?._selectors.answerWritten).click();
            cy.advanceToNextPage();
        } else if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.hearing) {
            cy.getByData(this?._selectors.answerHearing).click();
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferHearingDetails).type(lpaManageAppealsData?.appealProcess?.lpaPreferHearingDetails)
            cy.advanceToNextPage();
        } else if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.inquiry) {
            cy.getByData(this?._selectors.answerInquiry).click();
            cy.get(this._selectors?.lpaProcedurePreferenceLpaPreferInquiryDuration).type(lpaManageAppealsData?.appealProcess?.lpaProcedurePreferenceLpaPreferInquiryDuration)
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferInquiryDetails).type(lpaManageAppealsData?.appealProcess?.lpaPreferInquiryDetails)
            cy.advanceToNextPage();
        }
    };
    selectOngoingAppealsNextToSite(context, lpaManageAppealsData, appealType) {
        const basePage = new BasePage();
        if (context?.appealProcess?.isOngoingAppeals) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            this.selectNearbyAppeals(context, lpaManageAppealsData, appealType);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectNearbyAppeals(context, lpaManageAppealsData, appealType) {
        const basePage = new BasePage();
        if (context?.appealProcess?.isNearbyAppeals) {
            if (lpaManageAppealsData?.hasAppealType === appealType) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
            }
            cy.get('body').then($body => {
                if ($body.find(`.govuk-fieldset__heading:contains(${lpaManageAppealsData?.appealProcess?.addAnotherAppeal})`).length > 0) {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.nearbyAppealReference).type(lpaManageAppealsData?.appealProcess?.nearByAppealReference);
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            });
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectNewConditions(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.appealProcess?.isNewConditions) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.newConditionsNewConditionDetails).type(lpaManageAppealsData?.appealProcess?.conditionsAndDetails)
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
