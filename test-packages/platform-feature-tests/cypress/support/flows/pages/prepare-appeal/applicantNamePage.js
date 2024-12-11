// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class ApplicantNamePage {

    _selectors = {
        appellantFirstName: '#appellantFirstName',
        appellantLastName: '#appellantLastName',
        appellantCompanyName: '#appellantCompanyName',
    }

    addApplicantNameData() {
        const basePage = new BasePage();

        basePage.addTextField(this._selectors.appellantFirstName, 'firstname');
        basePage.addTextField(this._selectors.appellantLastName, 'lastname');
        basePage.addTextField(this._selectors.appellantCompanyName, 'companyname')

        cy.advanceToNextPage();
    };

}
