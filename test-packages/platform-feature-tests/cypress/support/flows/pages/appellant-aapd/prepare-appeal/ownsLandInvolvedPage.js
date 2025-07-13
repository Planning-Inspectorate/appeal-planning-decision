// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class OwnsLandInvolvedPage {

    _selectors = {
        ownsLandInvolvedYes: '[data-cy="answer-yes"]',
        ownsLandInvolvedSome: '[data-cy="answer-some"]',
        ownsLandInvolvedNo: '[data-cy="answer-no"]'
    }

    addOwnsLandInvolvedData(knowsAllOwners) {
        const basePage = new BasePage();

        if (knowsAllOwners === 'yes') {
            basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedYes);
            cy.advanceToNextPage();

            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            if (knowsAllOwners === 'some') {

                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedSome);
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

            } else if (knowsAllOwners === 'no') {

                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedNo);
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
            }
        }
    };
}