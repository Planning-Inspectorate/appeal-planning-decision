// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class MajorMinorDevelopmentPage {

    _selectors = {        
        majorMinorDevelopmentMajor: '[data-cy="answer-major"]',
        majorMinorDevelopmentMinor: '[data-cy="answer-minor"]',
        majorMinorDevelopmentOther: '[data-cy="answer-other"]'
    }

    addMajorMionorDevelopmentData(majorMinorDevelopment) {
        const basePage = new BasePage();

        if (majorMinorDevelopment === 'major') {
            basePage.clickRadioBtn(this._selectors.majorMinorDevelopmentMajor);
            cy.advanceToNextPage();
        } else {
            if (majorMinorDevelopment === 'minor') {
                basePage.clickRadioBtn(this._selectors.majorMinorDevelopmentMinor);
                cy.advanceToNextPage();               
            } else if (majorMinorDevelopment === 'other') {
                basePage.clickRadioBtn(this._selectors.majorMinorDevelopmentOther);
                cy.advanceToNextPage();
            }
        }
    };
}