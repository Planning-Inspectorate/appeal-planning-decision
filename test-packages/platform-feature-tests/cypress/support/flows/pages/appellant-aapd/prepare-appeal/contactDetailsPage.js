// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
export class ContactDetailsPage {

    _selectors = {
        contactFirstName: '#contactFirstName',
        contactLastName: '#contactLastName',
        contactCompanyName: '#contactCompanyName',
        contactPhoneNumber: '#contactPhoneNumber'
    }

    addContactDetailsData(context, applicationType,prepareAppealData) {
        const basePage = new BasePage();

        basePage.addTextField(this._selectors.contactFirstName,  prepareAppealData?.contactDetails?.firstName);
        basePage.addTextField(this._selectors.contactLastName, prepareAppealData?.contactDetails?.lastName);
        basePage.addTextField(this._selectors.contactCompanyName, prepareAppealData?.contactDetails?.companyName);
        cy.advanceToNextPage();

        cy.validateURL(`/appeals/${applicationType}/prepare-appeal/phone-number`);
        //What is your phone number?
        basePage.addTextField(this._selectors.contactPhoneNumber, prepareAppealData?.contactDetails?.contactPhoneNumber);
        cy.advanceToNextPage();
    };
}