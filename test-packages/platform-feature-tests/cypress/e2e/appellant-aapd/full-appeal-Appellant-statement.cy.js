// @ts-nocheck
/// <reference types="cypress"/>
import { statementTestCases } from "../../helpers/appellantAAPD/statementData";
import { users } from '../../fixtures/users.js';
const { statement } = require('../../support/flows/sections/appellantAAPD/statement');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Full Planning Statement Test Cases', { tags: '@S78-appellant-statement-Submission' }, () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        before(() => {
                cy.login(users.appeals.authUser);
        });
        beforeEach(() => {
                cy.fixture('prepareAppealData').then(data => {
                        prepareAppealData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/appeal/email-address')) {
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).clear();
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress1);
                                cy.advanceToNextPage();
                                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
        });
        statementTestCases.forEach((context) => {
                it(`
            Should validate Full appeal Statement ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        statement(context, prepareAppealData, prepareAppealData?.FullAppealType);
                });
        });
});