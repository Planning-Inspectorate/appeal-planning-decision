// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class SubmitPlanningObligationPage {
    _selectors = {
        answerFinalised: '[data-cy="answer-finalised"]',
        answerDraft: '[data-cy="answer-draft]',
        answerNotStartedYet: '[data-cy="answer-not started yet"]'
    }
    addSubmitPlanningObligationData(context) {
        const basePage = new BasePage();
        if (context?.uploadDocuments?.submitPlanningObligation) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            if (context?.uploadDocuments?.finalisedPlanningStatus === "ready") {
                basePage.clickRadioBtn(this._selectors?.answerFinalised);
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFinalisingDocReady);
                cy.advanceToNextPage();
            } else if (context?.uploadDocuments?.finalisedPlanningStatus === "draft") {
                basePage.clickRadioBtn(this._selectors?.answerDraft);
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFinalisingDocDraft);
                cy.advanceToNextPage();
            } else {
                basePage.clickRadioBtn(this._selectors?.answerNotStartedYet);
                cy.advanceToNextPage();
            }

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}