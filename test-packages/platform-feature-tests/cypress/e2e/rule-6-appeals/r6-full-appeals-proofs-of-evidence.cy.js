// @ts-nocheck
/// <reference types="cypress"/>
import { r6FullAppealsProofsOfEvidenceTestCases } from "../../helpers/rule6Appeals/r6FullAppealsProofsOfEvidenceData";
const { r6FullAppealsProofsOfEvidence } = require('../../support/flows/sections/rule6Appeals/r6FullAppealsProofsOfEvidence');
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
        r6FullAppealsProofsOfEvidenceTestCases.forEach((context) => {

                it(`
            Should validate Full appeal LPA Proof of evidence, Appeal Type: Rule 6 Appeals
            - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
             `, () => {
                        r6FullAppealsProofsOfEvidence(context, lpaManageAppealsData);
                });
        });
});