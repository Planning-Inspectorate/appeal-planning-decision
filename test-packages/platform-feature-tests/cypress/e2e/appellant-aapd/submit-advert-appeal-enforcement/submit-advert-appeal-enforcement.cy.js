// @ts-nocheck
/// <reference types="cypress"/>

import { advertAppealEnforcementTestCases } from "../../../helpers/appellantAAPD/advertEnforcementAppeal/advertEnforcementAppealData";
import { casAdvertAppealRefusedTestCases } from "../../../helpers/appellantAAPD/casAdvertAppeal/casAdvertAppealRefusedData";

import { commercialAdvertQuestionnaireTestCases as questionnaireTestCases } from "../../../helpers/lpaManageAppeals/commercialAdvertQuestionnaireData";
import { statementTestCases } from "../../../helpers/lpaManageAppeals/statementData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require("../../../support/flows/sections/appellantAAPD/appeal");

describe('Submit Advert Appeal Enforcement Test Cases', { tags: '@CAS-Advert-enforcement' }, () => {
    let prepareAppealData;
    let lpaManageAppealsData;
    before(() => {
        cy.login(users.appeals.authUser);
    });
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            
            //cy.pause(); // pause on before

            prepareAppealData = data;
        });
        cy.fixture('lpaManageAppealsData').then(data => {
            lpaManageAppealsData = data;
        });
    });
    
    advertAppealEnforcementTestCases.forEach((context) => {
        const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, typeOfPlanningApplication } = context;
        it(`Advert Enforcement Appeal: status=${statusOfOriginalApplication} decision=${typeOfDecisionRequested} obligation=${statusOfPlanningObligation}`, () => {
            submitAppealFlow({
                statusOfOriginalApplication,
                typeOfDecisionRequested,
                statusOfPlanningObligation,
                planning: typeOfPlanningApplication,
                context,
                prepareAppealData,
                lpaManageAppealsData,
				questionnaireTestCases,
				statementTestCases
            });
        });
    });
});
