import { BasePage } from "../../../../page-objects/base-page";
export class ApplicationNamePage {

    _selectors = {
        appellantFirstName: '#appellantFirstName',
        appellantLastName: '#appellantLastName',
        appellantCompanyName: '#appellantCompanyName'
    }

    addApplicationNameData(isAppellant) {
        const basePage = new BasePage();

        if (isAppellant) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        }
        else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            basePage.addTextField(this._selectors.appellantFirstName, 'firstname');
            basePage.addTextField(this._selectors.appellantLastName, 'lastname');
            basePage.addTextField(this._selectors.appellantCompanyName, 'companyname')
            cy.advanceToNextPage();
        }
    };

}