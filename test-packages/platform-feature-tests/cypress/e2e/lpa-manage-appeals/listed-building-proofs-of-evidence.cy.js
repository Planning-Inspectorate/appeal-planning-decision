// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/lpaManageAppeals/proofsOfEvidenceData";
import { users } from '../../fixtures/users.js';
const { proofsOfEvidence } = require('../../support/flows/sections/lpaManageAppeals/proofsOfEvidence');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Listed Building Questionnaire Test Cases', { tags: '@S20-LPA-POE-Submission' },() => {
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
        proofsOfEvidenceTestCases.forEach((context) => {

                it(`
            Should validate Listed Building LPA Proof of evidence, Appeal Type: Listed Building
            - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        proofsOfEvidence(context, lpaManageAppealsData, lpaManageAppealsData?.s20AppealType);
                });
        });
});