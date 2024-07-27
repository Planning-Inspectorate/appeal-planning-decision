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
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        }
        else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();
            basePage.addTextField(this._selectors.appellantFirstName, 'firstname');
            basePage.addTextField(this._selectors.appellantLastName, 'lastname');
            basePage.addTextField(this._selectors.appellantCompanyName, 'companyname')
            cy.advanceToNextPage();
        }
    };

}