//import { waitingForReview } from "../../pages/lpa-manage-appeals/waitingForReview";
// @ts-nocheck
/// <reference types="cypress"/>
import { YourAppealsSelector } from "../../../../page-objects/lpa-manage-appeals/your-appeals-selector";

export const viewValidatedAppealDetailsLPA = (appealId) => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaManageAppealsData;
        cy.fixture('lpaManageAppealsData').then(data => {
                lpaManageAppealsData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
        cy.url().then((url) => {
                if (url.includes('/manage-appeals/your-email-address')) {
                        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
                        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
                        cy.advanceToNextPage();
                        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
                        cy.advanceToNextPage();
                }
        });
        cy.contains(appealId, { timeout: 10000 }).should('exist');
        cy.contains(appealId, { timeout: 10000 }).click({ force: true });
};	