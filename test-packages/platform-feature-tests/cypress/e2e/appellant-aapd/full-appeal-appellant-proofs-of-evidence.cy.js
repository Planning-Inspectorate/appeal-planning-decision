// @ts-nocheck
/// <reference types="cypress"/>
import { appellantFullAppealProofsOfEvidenceTestCases } from "../../helpers/appellantAAPD/appellantFullAppealProofsOfEvidenceData";
const { appellantFullAppealProofsOfEvidence } = require('../../support/flows/sections/appellantAAPD/appellantFullAppealProofsOfEvidence');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");


describe('Appellant Full Planning Proof Of Evidence Test Cases', () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        beforeEach(() => {
                cy.fixture('prepareAppealData').then(data => {
                        prepareAppealData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/appeal/email-address')) {
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).clear();
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
                                cy.advanceToNextPage();
                                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
        });
        appellantFullAppealProofsOfEvidenceTestCases.forEach((context) => {

                it(`
                Should validate Appelant Full appeal Proof of evidence, Appeal Type: Full Planning
                - User selects add witnesses ${context.proofsOfEvidence?.isAddWitness}
                `, () => {
                        appellantFullAppealProofsOfEvidence(context, prepareAppealData);
                });
        });
});