// @ts-nocheck
/// <reference types="cypress"/>
import { r6FullAppealsStatementTestCases } from "../../helpers/rule6Appeals/r6FullAppealsStatementData";
import { users } from '../../fixtures/users.js';
const { r6FullAppealsStatement } = require('../../support/flows/sections/rule6Appeals/r6FullAppealsStatement');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Rule 6 Full Appeal Statement Test Cases', () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaManageAppealsData;
        beforeEach(() => {
                cy.login(users.appeals.authUser);
                cy.fixture('lpaManageAppealsData').then(data => {
                        lpaManageAppealsData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/rule-6/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/rule-6/email-address')) {
                                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
                                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.rule6EmailAddress);
                                cy.advanceToNextPage();
                                cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
        });
        r6FullAppealsStatementTestCases.forEach((context) => {
                it(`
            Should validate Full appeal R6 Statement, Appeal Type: Rule 6 Appeals
            - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        r6FullAppealsStatement(context, lpaManageAppealsData);
                });
        });
});