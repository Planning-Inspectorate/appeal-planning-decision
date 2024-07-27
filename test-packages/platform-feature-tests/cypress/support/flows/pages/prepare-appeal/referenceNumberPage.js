import { BasePage } from "../../../../page-objects/base-page";
export class ReferenceNumberPage {
    _selectors = {
        applicationReference: '#applicationReference'
    }

    addReferenceNumberData(isAgriculturalHolding, context) {
        const basePage = new BasePage();

        //What is application reference number?
        basePage.addTextField(this._selectors?.applicationReference, 'TEST-171947077123712345x6');
        cy.advanceToNextPage();
    };
}