// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";

export class AppealSiteAddressPage {

    _selectors = {
        addressLineOne: '#address-line-1',
        addressLineTwo: '#address-line-2',
        addressTown: '#address-town',
        addressCounty: '#address-county',
        addressPostcode: '#address-postcode'
    }

    addAppealSiteAddressData(prepareAppealData) {
        const basePage = new BasePage();

        basePage.addTextField(this._selectors?.addressLineOne, prepareAppealData?.appealSiteAddress?.addressLine1);
        basePage.addTextField(this._selectors?.addressLineTwo, prepareAppealData?.appealSiteAddress?.addressLine2);
        basePage.addTextField(this._selectors?.addressTown, prepareAppealData?.appealSiteAddress?.testTown);
        basePage.addTextField(this._selectors?.addressCounty, prepareAppealData?.appealSiteAddress?.testCounty);
        basePage.addTextField(this._selectors?.addressPostcode, prepareAppealData?.appealSiteAddress?.addressPostcode);
        cy.advanceToNextPage();
    };
}