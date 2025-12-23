// @ts-nocheck
/// <reference types="cypress"/>
import { PrepareAppealSelector } from "../../../../page-objects/prepare-appeal/prepare-appeal-selector";
export const viewValidatedAppealDetailsAppellant = (appealId) => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        cy.fixture('prepareAppealData').then(data => {
                prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
        cy.url().then((url) => {
                if (url.includes('/appeal/email-address')) {
                        cy.getById(prepareAppealSelector?._selectors?.emailAddress).clear();
                        cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
                        cy.advanceToNextPage();
                        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                        cy.advanceToNextPage();
                }
        });
};	