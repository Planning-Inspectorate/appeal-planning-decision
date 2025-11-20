// @ts-nocheck
/// <reference types="cypress"/>
import { users } from '../../fixtures/users.js';
import { advertQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/advertQuestionnaireData.js";
const { questionnaire } = require('../../support/flows/sections/lpaManageAppeals/questionnaire');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector.js");

describe('commercial advert Questionnaire Test Cases', { tags: '@Commercial-advert-LPAQ-Submission' } , () => {
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
        advertQuestionnaireTestCases.forEach((context) => {

                it(`
            Should validate advert questionnaire screen, Appeal Type: Cpmercial Advert
            - User selects correct type of appeal ${context.constraintsAndDesignations?.isCorrectTypeOfAppeal}
            - User selects change listed building ${context.constraintsAndDesignations?.isChangesListedBuilding}             
            - User selects affect listed buildings ${context.constraintsAndDesignations?.isAffectListedBuildings}
            - User selects affected listed buidings ${context.constraintsAndDesignations?.isAffectedListedBuildings}
            - User selects schedule monument ${context.constraintsAndDesignations?.isScheduleMonument}
            - User selects conservation area ${context.constraintsAndDesignations?.isConservationArea}
            - User selects protected spices ${context.constraintsAndDesignations?.isProtectedSpecies}
            - User selects protected spices ${context.constraintsAndDesignations?.isSpecialControl}
            - User selects green belt area ${context.constraintsAndDesignations?.isGreenBelt}
            - User selects area outstanding beauty  ${context.constraintsAndDesignations?.isAreaOutstandingBeauty}
            - User selects all designated sites ${context.constraintsAndDesignations?.isAllDesignatedSite}           
            - User selects statutory consultees ${context.consultResponseAndRepresent?.isStatutoryConsultees}            
            - User selects other party representations ${context.consultResponseAndRepresent?.isOtherPartyRepresentations}
            - User selects highway ${context.poReportAndSupportDocs?.isHighway}
            - User selects photographsplan ${context.poReportAndSupportDocs?.isPhotographsPlans}
            - User selects statutoryplan ${context.poReportAndSupportDocs?.isStatutoryPlan}
            - User selects emerging plan ${context.poReportAndSupportDocs?.isEmergingPlan}
            - User selects relevantpolocies ${context.poReportAndSupportDocs?.isRelevantPolcies}
            - User selects supplementary planning doc ${context.poReportAndSupportDocs?.isSupplementaryPlanningDocs}            
            - User selects lpa site access ${context.siteAccess?.isLpaSiteAccess}
            - User selects neighbour site access${context.siteAccess?.isNeighbourSiteAccess}
            - User selects lpa site safety risks${context.siteAccess?.isLpaSiteSafetyRisks}
            - User selects ongoing appeals${context.appealProcess?.isOngoingAppeals}
            - User selects nearby appeals${context.appealProcess?.isNearbyAppeals}
            - User selects new conditions${context.appealProcess?.isNewConditions}
            - User selects procedure type${context.appealProcess?.isProcedureType}
             `, () => {
                       questionnaire(context, lpaManageAppealsData, lpaManageAppealsData?.commercialadvAppealType);
                });
        });
});