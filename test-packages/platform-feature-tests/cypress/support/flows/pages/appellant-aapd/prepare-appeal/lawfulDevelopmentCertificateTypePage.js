// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class LawfulDevelopmentCertificateTypePage {

    _selectors = {
        ldcExistingDevelopment: '[data-cy="answer-existing-development"]',
        ldcProposedUseOfDevelopment: '[data-cy="answer-proposed-use-of-a-development"]',
        ldcProposedChangesToListedBuilding: '[data-cy="answer-proposed-changes-to-a-listed-building"]',
    }
    addLawfulDevelopmentCertificateTypeData(ldcType) {
        const basePage = new BasePage();

        if (ldcType === 'existing-development') {
            basePage.clickRadioBtn(this._selectors.ldcExistingDevelopment);
            cy.advanceToNextPage();
        } else {
            if (ldcType === 'proposed-use-of-a-development') {
                basePage.clickRadioBtn(this._selectors.ldcProposedUseOfDevelopment);
                cy.advanceToNextPage();
            } else if (ldcType === 'proposed-changes-to-a-listed-building') {
                basePage.clickRadioBtn(this._selectors.ldcProposedChangesToListedBuilding);
                cy.advanceToNextPage();
            }
        }
    };
}