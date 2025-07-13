// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/lpaManageAppeals/proofsOfEvidenceData";
const { proofsOfEvidence } = require('../../support/flows/sections/lpaManageAppeals/proofsOfEvidence');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Questionnaire Test Cases', () => {
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
        proofsOfEvidenceTestCases.forEach((context) => {

                it(`
            Should validate Full appeal LPA Proof of evidence, Appeal Type: Full Planning
            - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        proofsOfEvidence(context, lpaManageAppealsData, lpaManageAppealsData?.s78AppealType);
                });
        });
});