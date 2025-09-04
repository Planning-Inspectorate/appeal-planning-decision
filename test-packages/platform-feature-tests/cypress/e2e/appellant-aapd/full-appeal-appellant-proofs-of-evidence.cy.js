// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/appellantAAPD/proofsOfEvidenceData";
import { users } from '../../fixtures/users.js';
const { proofsOfEvidence } = require('../../support/flows/sections/appellantAAPD/proofsOfEvidence');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Appellant Full Planning Proof Of Evidence Test Cases',{ tags: '@S78-appellant-POE-Submission' }, () => {
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
        proofsOfEvidenceTestCases.forEach((context) => {

                it(`
                Should validate Appelant Full appeal Proof of evidence, Appeal Type: Full Planning
                - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
                `, () => {
                        proofsOfEvidence(context, prepareAppealData, prepareAppealData?.FullAppealType);
                });
        });
});