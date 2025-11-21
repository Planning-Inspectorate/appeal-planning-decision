// @ts-nocheck
/// <reference types="cypress"/>

import { advertAppealNoDecisionTestCases } from "../../../helpers/appellantAAPD/advertAppeal/advertAppealNoDecisionData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require("../../../support/flows/sections/appellantAAPD/appeal");

describe('Submit Advert Appeal No Decision Test Cases', { tags: '@Advert-nodecision' }, () => {
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
    advertAppealNoDecisionTestCases.forEach((context) => {
        const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, typeOfPlanningApplication } = context;
        it(`Advert No Decision Appeal: status=${statusOfOriginalApplication} decision=${typeOfDecisionRequested} obligation=${statusOfPlanningObligation}`, () => {
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
