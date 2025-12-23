// @ts-nocheck
/// <reference types="cypress"/>

import { advertAppealGrantedTestCases } from "../../../helpers/appellantAAPD/advertAppeal/advertAppealGrantedData";
import { advertQuestionnaireTestCases as questionnaireTestCases } from "../../../helpers/lpaManageAppeals/advertQuestionnaireData";
import { statementTestCases } from "../../../helpers/lpaManageAppeals/statementData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require("../../../support/flows/sections/appellantAAPD/appeal");

describe('Submit Advert Appeal Granted Test Cases', { tags: '@Advert-granted' }, () => {
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
    advertAppealGrantedTestCases.forEach((context) => {
        const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, typeOfPlanningApplication } = context;
        it(`Advert Granted Appeal: status=${statusOfOriginalApplication} decision=${typeOfDecisionRequested} obligation=${statusOfPlanningObligation}`, () => {
            submitAppealFlow({
                statusOfOriginalApplication,
                typeOfDecisionRequested,
                statusOfPlanningObligation,
                planning: typeOfPlanningApplication,
                context, //: { ...context, advertAppeal: true },
                prepareAppealData,
                lpaManageAppealsData,
				questionnaireTestCases,
				statementTestCases
            });
        });
    });
});
