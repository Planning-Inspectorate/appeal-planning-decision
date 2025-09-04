// @ts-nocheck
/// <reference types="cypress"/>
import { finalCommentTestCases } from "../../helpers/lpaManageAppeals/finalCommentData";
import { users } from '../../fixtures/users.js';
const { finalComment } = require('../../support/flows/sections/lpaManageAppeals/finalComment');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Final comment Test Cases', { tags: '@S78-LPA-Final-Comment-Submission' }, () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaManageAppealsData;
        before(() => {
                cy.login(users.appeals.authUser);
        });
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
        finalCommentTestCases.forEach((context) => {
                it(`
            Should validate Full appeal LPA Final comment Submission, Appeal Type: Full Planning       
             `, () => {
                        finalComment(context, lpaManageAppealsData, lpaManageAppealsData?.s78AppealType);
                });
        });
});