import { houseHolderQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/houseHolderQuestionnaireData";
const { lpaQuestionnaire } = require('../../support/flows/sections/lpaManageAppeals/houseHolderQuestionnaire');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('House Holder Questionnaire Test Cases', () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaQuestionnaireData;
        beforeEach(() => {
                cy.fixture('lpaQuestionnaireData').then(data => {
                        lpaQuestionnaireData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
               // const emailurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`;
               // const appealurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`;
                cy.url().then((url) => {
                        if (url.includes('/manage-appeals/your-email-address')) {
                                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear().type(lpaQuestionnaireData?.emailAddress);
                                cy.wait(1000);
                                cy.advanceToNextPage();
                                cy.wait(1000);
                                cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaQuestionnaireData?.emailCode);
                                cy.advanceToNextPage();
                        }
                });

        });
        houseHolderQuestionnaireTestCases.forEach((context) => {

                it(`
            Should validate House holder questionnaire screen, Appeal Type: HAS 
            - User selects correct type of appeal ${context.constraintsAndDesignations?.isCorrectTypeOfAppeal}
            - User selects affect listed buildings ${context.constraintsAndDesignations?.isAffectListedBuildings}
            - User selects affected listed buidings ${context.constraintsAndDesignations?.isAffectedListedBuildings}
            - User selects conservation area ${context.constraintsAndDesignations?.isConservationArea}
            - User selects green belt area ${context.constraintsAndDesignations?.isGreenBelt}              
            - User selects other party representations ${context.consultResponseAndRepresent?.isOtherPartyRepresentations}

            - User selects emerging plan ${context.poReportAndSupportDocs?.isEmergingPlan}
            - User selects supplementary planning doc ${context.poReportAndSupportDocs?.isSupplementaryPlanningDocs}
            - User selects lpa site access ${context.siteAccess?.isLpaSiteAccess}
            - User selects neighbour site access${context.siteAccess?.isNeighbourSiteAccess}
            - User selects lpa site safety risks${context.siteAccess?.isLpaSiteSafetyRisks}
            - User selects ongoing appeals${context.appealProcess?.isOngoingAppeals}
            - User selects nearby appeals${context.appealProcess?.isNearbyAppeals}
            - User selects new conditions${context.appealProcess?.isNewConditions}          
             `, () => {
                        lpaQuestionnaire(context, lpaQuestionnaireData);
                });
        });
});