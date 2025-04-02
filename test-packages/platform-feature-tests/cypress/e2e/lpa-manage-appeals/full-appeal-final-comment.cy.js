// @ts-nocheck
/// <reference types="cypress"/>
import { fullAppealFinalCommentTestCases } from "../../helpers/lpaManageAppeals/fullAppealFinalCommentData";
const { fullAppealFinalComment } = require('../../support/flows/sections/lpaManageAppeals/fullAppealFinalComment');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Final comment Test Cases', () => {
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
        });
        fullAppealFinalCommentTestCases.forEach((context) => {

                it(`
            Should validate Full appeal LPA Final comment, Appeal Type: Full Planning       
             `, () => {
                        fullAppealFinalComment(context, lpaManageAppealsData);
                });
        });
});