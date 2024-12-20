// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class EnterDescriptionOfDevelopmentPage {

    _selectors = {
        developmentDescriptionOriginal: '#developmentDescriptionOriginal'
    }

    addEnterDescriptionOfDevelopmentData() {
        const basePage = new BasePage();

        //Enter the description of development that you submitted in your application
        basePage.addTextField(this._selectors?.developmentDescriptionOriginal, 'developmentDescriptionOriginal-hint123456789!£$%&*j');
        cy.advanceToNextPage();
    };
}