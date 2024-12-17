// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class TellingLandownersPage {

    _selectors = {
        informedOwners: '#informedOwners'
    }

    addTellingLandownersData() {
        const basePage = new BasePage();

        basePage.clickCheckBox(this._selectors?.informedOwners);
        cy.advanceToNextPage();
    };
}