// @ts-nocheck
/// <reference types="cypress"/>
import { statementTestCases } from "../../helpers/lpaManageAppeals/statementData";
const { statement } = require('../../support/flows/sections/lpaManageAppeals/statement');
import { users } from '../../fixtures/users.js';
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Statement Test Cases', { tags: '@S78-LPA-statement-Submission' }, () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaManageAppealsData;        
        beforeEach(() => {
                cy.login(users.appeals.authUser);
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
        statementTestCases.forEach((context) => {

                it(`
            Should validate Full appeal LPA statement submission ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        statement(context, lpaManageAppealsData, lpaManageAppealsData?.s78AppealType);
                });
        });
});