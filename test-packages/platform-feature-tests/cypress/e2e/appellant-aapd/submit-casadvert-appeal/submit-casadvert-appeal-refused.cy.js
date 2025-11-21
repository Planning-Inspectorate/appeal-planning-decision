// @ts-nocheck
/// <reference types="cypress"/>

import { casAdvertAppealRefusedTestCases } from "../../../helpers/appellantAAPD/casAdvertAppeal/casAdvertAppealRefusedData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require("../../../support/flows/sections/appellantAAPD/appeal");

describe('Submit CAS Advert Appeal Refused Test Cases', { tags: '@CAS-Advert-refused' }, () => {
    let prepareAppealData;
    let lpaManageAppealsData;
    before(() => {
        cy.login(users.appeals.authUser);
    });
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        });
        cy.fixture('lpaManageAppealsData').then(data => {
            lpaManageAppealsData = data;
        });
    });
    casAdvertAppealRefusedTestCases.forEach((context) => {
        const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, typeOfPlanningApplication } = context;
        it(`CAS Advert Refused Appeal: status=${statusOfOriginalApplication} decision=${typeOfDecisionRequested} obligation=${statusOfPlanningObligation}`, () => {
            submitAppealFlow({
                statusOfOriginalApplication,
                typeOfDecisionRequested,
                statusOfPlanningObligation,
                planning: typeOfPlanningApplication,
                context,
                prepareAppealData,
                lpaManageAppealsData
            });
        });
    });
});
