import { BasePage } from "../../../../page-objects/base-page";

export class AppealSiteAddressPage {

    _selectors = {
        addressLineOne: '#address-line-1',
        addressLineTwo: '#address-line-2',
        addressTown: '#address-town',
        addressCounty: '#address-county',
        addressPostcode: '#address-postcode'
    }

    addAppealSiteAddressData() {
        const basePage = new BasePage();

        basePage.addTextField(this._selectors?.addressLineOne, 'siteAddress_addressLine1');
        basePage.addTextField(this._selectors?.addressLineTwo, 'siteAddress_addressLine2');
        basePage.addTextField(this._selectors?.addressTown, 'Test Town');
        basePage.addTextField(this._selectors?.addressCounty, 'Test County1');
        basePage.addTextField(this._selectors?.addressPostcode, 'SW7 9PB');
        cy.advanceToNextPage();
    };
}