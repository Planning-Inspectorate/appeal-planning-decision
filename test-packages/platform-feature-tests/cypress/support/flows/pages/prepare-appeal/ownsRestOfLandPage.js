// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class OwnsRestOfLandPage {

    _selectors = {
        ownsRestOfLandYes: '[data-cy="answer-yes"]',
        ownsRestOfLandSome: '[data-cy="answer-some"]',
        ownsRestOfLandNo: '[data-cy="answer-no"]'
    }

    addOwnsRestOfLandgData(knowsOtherOwners) {
        const basePage = new BasePage();

        if (knowsOtherOwners === 'yes') {

            basePage.clickRadioBtn(this._selectors?.ownsRestOfLandYes);
            cy.advanceToNextPage();

            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            if (knowsOtherOwners === 'some') {

                basePage.clickRadioBtn(this._selectors?.ownsRestOfLandSome);
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

            } else if (knowsOtherOwners === 'no') {

                basePage.clickRadioBtn(this._selectors?.ownsRestOfLandNo);
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
            }
        }
    };
}