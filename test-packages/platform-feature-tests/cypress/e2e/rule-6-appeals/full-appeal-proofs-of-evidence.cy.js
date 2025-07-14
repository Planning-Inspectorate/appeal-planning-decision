// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/rule6Appeals/proofsOfEvidenceData";
const { proofsOfEvidence } = require('../../support/flows/sections/rule6Appeals/proofsOfEvidence');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Rule 6 Proof of Evidence Test Cases', () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaManageAppealsData;
        beforeEach(() => {
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
        proofsOfEvidenceTestCases.forEach((context) => {

                it(`
            Should validate Full appeal LPA Proof of evidence, Appeal Type: Rule 6 Appeals
            - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        proofsOfEvidence(context, lpaManageAppealsData, lpaManageAppealsData?.s78AppealType);
                });
        });
});