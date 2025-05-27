// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../page-objects/base-page";
import { appellantAllowedDowloadVerify, appellantAllowedInPartDowloadVerify } from "../../support/flows/sections/appellantAAPD/appellantDownloadVerify";
import { PrepareAppealSelector } from "../../page-objects/prepare-appeal/prepare-appeal-selector";
import { users } from "../../fixtures/users.js";
describe('Appellant Decided Appeals', () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    let prepareAppealData;
    beforeEach(() => {
        cy.login(users.appeals.authUser);
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })

        cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/new-saved-appeal`);
        basePage.clickRadioBtn('#new-or-saved-appeal-2');
        cy.advanceToNextPage();
        cy.url().then((url) => {
            if (url.includes('/appeal/email-address')) {
                cy.get(`#${prepareAppealSelector?._selectors?.emailAddress}`).clear();
                cy.get(`#${prepareAppealSelector?._selectors?.emailAddress}`).type(prepareAppealData?.email?.emailAddress);
                cy.advanceToNextPage();
                cy.get(`${prepareAppealSelector?._selectors?.emailCode}`).type(prepareAppealData?.email?.emailCode);
                cy.advanceToNextPage();
            }
        });
    })

    it(`Appeallant Allowed Decided Appeals`, () => {
        appellantAllowedDowloadVerify(prepareAppealData);
    });

    it(`Appeallant Manage Allowed In part Decided Appeals`, () => {
        appellantAllowedInPartDowloadVerify(prepareAppealData);
    });

});