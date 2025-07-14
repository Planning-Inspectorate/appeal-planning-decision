// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class ApplicationNamePage {

    _selectors = {
        appellantFirstName: '#appellantFirstName',
        appellantLastName: '#appellantLastName',
        appellantCompanyName: '#appellantCompanyName'
    }

    addApplicationNameData(isAppellant,prepareAppealData) {
        const basePage = new BasePage();

        if (isAppellant) {
            cy.getByData(basePage?._selectors.answerYes).click({ force: true });
            cy.advanceToNextPage();
        }
        else {
            cy.getByData(basePage?._selectors.answerNo).click({ force: true });
            cy.advanceToNextPage();
            basePage.addTextField(this._selectors.appellantFirstName, prepareAppealData?.applicationName?.firstName);
            basePage.addTextField(this._selectors.appellantLastName, prepareAppealData?.applicationName?.lastName);
            basePage.addTextField(this._selectors.appellantCompanyName, prepareAppealData?.applicationName?.companyName)
            cy.advanceToNextPage();
        }
    };

}