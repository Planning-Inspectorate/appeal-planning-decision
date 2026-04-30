// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class AnySignificantChangesPage {

    _selectors = {
        procedurePreferenceWritten: '[data-cy="answer-written"]',
        procedurePreferenceHearing: '[data-cy="answer-hearing"]',
        procedurePreferenceInquiry: '[data-cy="answer-inquiry"]',
        anySignificantChangesLocalPlanSignificantChanges: '#anySignificantChanges_localPlanSignificantChanges',
        anySignificantChangesNationalPolicySignificantChanges: '#anySignificantChanges_nationalPolicySignificantChanges',
        anySignificantChangesCourtJudgementSignificantChanges: '#anySignificantChanges_courtJudgementSignificantChanges',
        anySignificantChangesOtherSignificantChanges: '#anySignificantChanges_otherSignificantChanges'
    }

    selectSignificantChanges(anySignificantChangesCondition) {
        const basePage = new BasePage();

        if (anySignificantChangesCondition) {
            cy.get('#anySignificantChanges').click();
            basePage.addTextField(this._selectors.anySignificantChangesLocalPlanSignificantChanges, 'test adopted new local plan significant changes');
            cy.get('#anySignificantChanges-2').click();
            basePage.addTextField(this._selectors.anySignificantChangesNationalPolicySignificantChanges, 'test adopted new national policy significant changes');
            cy.get('#anySignificantChanges-3').click();
            basePage.addTextField(this._selectors.anySignificantChangesCourtJudgementSignificantChanges, 'test adopted new court judgement significant changes');
            cy.get('#anySignificantChanges-4').click();
            basePage.addTextField(this._selectors.anySignificantChangesOtherSignificantChanges, 'test adopted new other significant changes');
            cy.advanceToNextPage();
        } else {
            cy.get('#anySignificantChanges-6').click();
            cy.advanceToNextPage();
        }
    };
}