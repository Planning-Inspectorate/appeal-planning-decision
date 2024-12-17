// @ts-nocheck
/// <reference types="cypress"/>
import { fullAppealQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/fullAppealQuestionnaireData";
const { fullAppealQuestionnaire } = require('../../support/flows/sections/lpaManageAppeals/fullAppealQuestionnaire');
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
        fullAppealQuestionnaireTestCases.forEach((context) => {

                it(`
            Should validate Full appeal questionnaire screen, Appeal Type: Full Planning
            - User selects correct type of appeal ${context.constraintsAndDesignations?.isCorrectTypeOfAppeal}
            - User selects changes listed building ${context.constraintsAndDesignations?.isChangesListedBuilding}
            - User selects affect listed buildings ${context.constraintsAndDesignations?.isAffectListedBuildings}
            - User selects affected listed buidings ${context.constraintsAndDesignations?.isAffectedListedBuildings}
            - User selects schedule monument ${context.constraintsAndDesignations?.isScheduleMonument}
            - User selects conservation area ${context.constraintsAndDesignations?.isConservationArea}
            - User selects protected spices ${context.constraintsAndDesignations?.isProtectedSpecies}
            - User selects green belt area ${context.constraintsAndDesignations?.isGreenBelt}
            - User selects area outstanding beauty  ${context.constraintsAndDesignations?.isAreaOutstandingBeauty}
            - User selects all designated sites ${context.constraintsAndDesignations?.isAllDesignatedSite}
            - User selects tree preservation order ${context.constraintsAndDesignations?.isTreePreservationOrder}
            - User selects gypsy traveller ${context.constraintsAndDesignations?.isGypsyTraveller}
            - User selects public right of way ${context.constraintsAndDesignations?.isPublicRightOfWay}
            - User selects schedule type ${context.environmentalImpact?.isSchedule}
            - User selects environmant statement ${context.environmentalImpact?.isEnvStmt}
            - User selects screen openion environment statement ${context.environmentalImpact?.isScreenOpenionEnvStmt}
            - User selects agriculture aquaculture ${context.environmentalImpact?.isAgricultureAquaculture}
            - User selects change extensions ${context.environmentalImpact?.isChangeExtensions}
            - User selects chemical industry ${context.environmentalImpact?.isChemicalIndustry}
            - User selects energy industry ${context.environmentalImpact?.isEnergyIndustry}
            - User selects extractive industry ${context.environmentalImpact?.isExtractiveIndustry}
            - User selects food industry ${context.environmentalImpact?.isFoodIndustry}
            - User selects infrastructure projects ${context.environmentalImpact?.isInfrastructureProjects}
            - User selects mineral industry ${context.environmentalImpact?.isMineralIndustry}
            - User selects other projects ${context.environmentalImpact?.isOtherProjects}
            - User selects production processing of metals ${context.environmentalImpact?.isProductionProcessingOfMetals}
            - User selects rubber industry ${context.environmentalImpact?.isRubberIndustry}
            - User selects textile industries ${context.environmentalImpact?.isTextileIndustries}
            - User selects tourism leisure ${context.environmentalImpact?.isTourismLeisure}
            - User selects sensitive area ${context.environmentalImpact?.isSensitiveArea}
            - User selects statutory consultees ${context.consultResponseAndRepresent?.isStatutoryConsultees}
            - User selects consultation responses ${context.consultResponseAndRepresent?.isConsultationResponses}
            - User selects other party representations ${context.consultResponseAndRepresent?.isOtherPartyRepresentations}
            - User selects emerging plan ${context.poReportAndSupportDocs?.isEmergingPlan}
            - User selects supplementary planning doc ${context.poReportAndSupportDocs?.isSupplementaryPlanningDocs}
            - User selects community infrastructure levy ${context.poReportAndSupportDocs?.isCommunityInfrastructureLevy}
            - User selects community infrastructure levy adopted ${context.poReportAndSupportDocs?.isCommunityInfrastructureLevyAdopted}
            - User selects lpa site access ${context.siteAccess?.isLpaSiteAccess}
            - User selects neighbour site access${context.siteAccess?.isNeighbourSiteAccess}
            - User selects lpa site safety risks${context.siteAccess?.isLpaSiteSafetyRisks}
            - User selects ongoing appeals${context.appealProcess?.isOngoingAppeals}
            - User selects nearby appeals${context.appealProcess?.isNearbyAppeals}
            - User selects new conditions${context.appealProcess?.isNewConditions}
            - User selects procedure type${context.appealProcess?.isProcedureType}
             `, () => {
                        fullAppealQuestionnaire(context, lpaManageAppealsData);
                });
        });
});