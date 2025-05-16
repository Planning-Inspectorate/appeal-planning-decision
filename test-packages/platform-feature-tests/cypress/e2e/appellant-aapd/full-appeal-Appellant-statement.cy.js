// @ts-nocheck
/// <reference types="cypress"/>
import { statementTestCases } from "../../helpers/representations/statementData";
const { statement } = require('../../support/flows/sections/representations/statement');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Full Planning Statement Test Cases', () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        beforeEach(() => {
                cy.fixture('prepareAppealData').then(data => {
                        prepareAppealData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/appeal/your-email-address')) {
                                cy.getByData(prepareAppealSelector?._selectors?.emailAddress).clear();
                                cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.emailAddress);
                                cy.advanceToNextPage();
                                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
        });
        statementTestCases.forEach((context) => {

                it(`
            Should validate Full appeal Statemnet ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        statement(context, prepareAppealData);
                });
        });
});