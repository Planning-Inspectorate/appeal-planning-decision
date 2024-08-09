import { BasePage } from "../../../../page-objects/base-page";
export class ContactDetailsPage {

    _selectors = {
        contactFirstName: '#contactFirstName',
        contactLastName: '#contactLastName',
        contactCompanyName: '#contactCompanyName',
        contactPhoneNumber: '#contactPhoneNumber'
    }

    addContactDetailsData(context, applicationType) {
        const basePage = new BasePage();

        basePage.addTextField(this._selectors.contactFirstName, 'Contact firstname');
        basePage.addTextField(this._selectors.contactLastName, 'Contact lastname');
        basePage.addTextField(this._selectors.contactCompanyName, 'Test Company');
        cy.advanceToNextPage();

        cy.url().should('include', `/appeals/${applicationType}/prepare-appeal/phone-number`);
        //What is your phone number?
        basePage.addTextField(this._selectors.contactPhoneNumber, '07654321000');
        cy.advanceToNextPage();
    };

}