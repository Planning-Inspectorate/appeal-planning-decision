// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class SiteAreaPage {

    _selectors = {
        siteAreaSquareMetres: '#siteAreaSquareMetres',
        siteAreaSquareMetresHectares: '#siteAreaSquareMetres_hectares',
        siteAreaSquareMetresMSauare: '#siteAreaSquareMetres_m²',
        siteAreaUnitsHectares: '[data-cy="answer-ha"]',
        siteAreaUnitsMetres: '[data-cy="answer-m²"]'
    }

    addSiteAreaData(applicationType, areaUnits, context, prepareAppealData) {
        const basePage = new BasePage();

        if (applicationType === 'answer-householder-planning' && context?.statusOfOriginalApplication === 'refused') {
            basePage.addTextField(this._selectors?.siteAreaSquareMetres, prepareAppealData?.siteArea?.squareMetres);
            cy.advanceToNextPage();
        }
        else {
            if (areaUnits === 'hectare') {
                basePage.clickRadioBtn(this._selectors?.siteAreaUnitsHectares);
                basePage.addTextField(this._selectors?.siteAreaSquareMetresHectares, prepareAppealData?.siteArea?.squareHectares);
                cy.advanceToNextPage();
            }
            else {
                basePage.clickRadioBtn(this._selectors?.siteAreaUnitsMetres);
                basePage.addTextField(this._selectors?.siteAreaSquareMetresMSauare, prepareAppealData?.siteArea?.squareMetres);
                cy.advanceToNextPage();
            }
        }
    };
}