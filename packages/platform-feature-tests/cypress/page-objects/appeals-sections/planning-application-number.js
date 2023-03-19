import { BasePage } from "./base-page";

export class ApplicationNumber extends BasePage{
    elements = {
        appNumber: () => cy.get('[data-cy="application-number"]')
    }

    enterAppNumber(appNumber){
        this.elements.appNumber().type(appNumber)
    }
}