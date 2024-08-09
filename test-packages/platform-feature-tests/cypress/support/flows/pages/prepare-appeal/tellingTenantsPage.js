import { BasePage } from "../../../../page-objects/base-page";
export class TellingTenantsPage {

    _selectors = {
        informedTenantsAgriculturalHolding: '#informedTenantsAgriculturalHolding'
    }

    addTellingTenantsData() {
        const basePage = new BasePage();

        basePage.clickCheckBox(this._selectors?.informedTenantsAgriculturalHolding);

        cy.advanceToNextPage();
    };
}