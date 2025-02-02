// @ts-nocheck
/// <reference types="cypress"/>

import { decisionAllowedDowloadVerify, decisionAllowedInPartDowloadVerify, decisionDismissedVerification } from "../../support/flows/sections/lpaManageAppeals/downloadVerify";

const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");


describe('LPA Manage Appeals Questionnaire', () => {
    const yourAppealsSelector = new YourAppealsSelector();
    let lpaManageAppealsData;
    beforeEach(() => {
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
    })

    it(`LPA Manage Allowed Decided Appeals`, () => {
        decisionAllowedDowloadVerify(lpaManageAppealsData);
    });

    it(`LPA Manage Allowed In part Decided Appeals`, () => {
        decisionAllowedInPartDowloadVerify(lpaManageAppealsData);
    });
    it(`LPA Manage Dismissed  Decided Appeals`, () => {
        decisionDismissedVerification(lpaManageAppealsData);
    });
});