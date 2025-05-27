
// @ts-nocheck
/// <reference types="cypress"/>
const { BasePage } = require("../../../../page-objects/base-page");
export class IpComments {
    _selectors = {
        postcode: '#postcode',
        appealReference: '#appeal-reference',
        firstName: '#first-name',
        lastName: '#last-name',
        addressLine1: '#address-line-1',
        addressLine2: '#address-line-2',
        addressTown: '#address-town',
        addressCounty: '#address-county',
        addressPostcode: '#address-postcode',
        emailAddress: '#email-address',
        comments: '#comments',
        commentsConfirmation: '#comments-confirmation',
        submitButton: 'button[type="submit"]'      
    }
    submitIpComments() {
        const basePage = new BasePage();       
        cy.get(this?._selectors.firstName).type('Test First Name');
        cy.get(this?._selectors.lastName).type('Test Last Name');
        cy.advanceToNextPage();
        cy.get(this?._selectors.addressLine1).type('Address Line One');
        cy.get(this?._selectors.addressLine2).type('Address Line Two');
        cy.get(this?._selectors.addressTown).type('Address Town');
        cy.get(this?._selectors.addressCounty).type('Address County');
        cy.get(this?._selectors.addressPostcode).type('SW7 9PB');
        cy.advanceToNextPage();
        cy.get(this?._selectors.emailAddress).type('commenter@email.com');
        cy.advanceToNextPage();
        cy.get(this?._selectors.comments).type('Interested Party comments with reference number');
        cy.get(this?._selectors.commentsConfirmation).check();
        cy.advanceToNextPage();
        cy.get(basePage?._selectors?.govukButton).contains('Submit comments').click({ force: true });
    };   
}