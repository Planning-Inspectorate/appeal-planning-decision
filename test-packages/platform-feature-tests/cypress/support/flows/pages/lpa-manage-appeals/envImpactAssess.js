import { BasePage } from "../../../../page-objects/base-page";
export class EnvImpactAssess {
    _selectors = {
        yesScheduleOne: "answer-schedule-1",
        yesScheduleTwo: "answer-schedule-2",
        noScheduleThree: "answer-no",
        ansAgricultureAquaculture: "answer-agriculture-aquaculture",
        ansChangeExtensions: "answer-change-extensions",
        ansChemicalIndustry: "answer-chemical-industry",
        ansEnergyIndustry: "answer-energy-industry",
        ansExtractiveIndustry: "answer-extractive-industry",
        ansFoodIndustry: "answer-food-industry",
        ansInfrastructureProject: "answer-infrastructure-projects",
        ansMineralIndustry: "answer-mineral-industry",
        ansOtherProjects: "answer-other-projects",
        ansProductionProcessingOfMetals: "answer-production-processing-of-metals",
        ansRubberIndustry: "answer-rubber-industry",
        ansTextileIndustries: "answer-textile-industries",
        ansTourismLeisure: "answer-tourism-leisure",
        sensitiveAreaSensitiveAreaDetails: "#sensitiveArea_sensitiveAreaDetails"
    }

    selectScheduleType(context, lpaManageAppealsData) {
        if (context?.environmentalImpact?.isSchedule === 'one') {
            this.selectScheduleOne(context, lpaManageAppealsData);
        } else if (context?.environmentalImpact?.isSchedule === 'two') {
            this.selectScheduleTwo(context, lpaManageAppealsData);
        } else if (context?.environmentalImpact?.isSchedule === 'no') {
            this.selectScheduleNo(context, lpaManageAppealsData);
        }
    };

    selectScheduleOne(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        cy.getByData(this?._selectors.yesScheduleOne).click();
        cy.advanceToNextPage();
        //Upload your screening opinion and any correspondence
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        this.selectScreeningOpinionEnvStmt(context);
        this.selectEnvironmentalStatement(context);
    };

    selectEnvironmentalStatement(context) {
        const basePage = new BasePage();
        if (context?.environmentalImpact?.isEnvStmt) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the environmental statement and supporting information
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            //Upload the screening direction
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();
        }
    }
    selectScheduleTwo(context, lpaManageAppealsData) {
        cy.getByData(this?._selectors.yesScheduleTwo).click();
        cy.advanceToNextPage();
        this.selectDevelopmentDescription(context, lpaManageAppealsData);
        this.selectAffectSensitiveArea(context, lpaManageAppealsData);
        this.selectThresholdOrCriteriaColumn2(context);
        this.selectIssuedScreeningOpinion(context);
        this.selectEnvironmentalStatement(context);
    };

    selectScheduleNo(context, lpaManageAppealsData) {
        cy.getByData(this?._selectors.noScheduleThree).click();
        cy.advanceToNextPage();
        this.selectIssuedScreeningOpinion(context);
        this.selectEnvironmentalStatement(context);
    };


    selectDevelopmentDescription(context, lpaManageAppealsData) {
        if (context?.environmentalImpact?.isAgricultureAquaculture) {
            cy.getByData(this?._selectors.ansAgricultureAquaculture).click();
        } else if (context?.environmentalImpact?.isChangeExtensions) {
            cy.getByData(this?._selectors.ansChangeExtensions).click();
        } else if (context?.environmentalImpact?.isChemicalIndustry) {
            cy.getByData(this?._selectors.ansChemicalIndustry).click();
        } else if (context?.environmentalImpact?.isEnergyIndustry) {
            cy.getByData(this?._selectors.ansEnergyIndustry).click();
        } else if (context?.environmentalImpact?.isExtractiveIndustry) {
            cy.getByData(this?._selectors.ansExtractiveIndustry).click();
        } else if (context?.environmentalImpact?.isFoodIndustry) {
            cy.getByData(this?._selectors.ansFoodIndustry).click();
        } else if (context?.environmentalImpact?.isInfrastructureProjects) {
            cy.getByData(this?._selectors.ansInfrastructureProject).click();
        } else if (context?.environmentalImpact?.isMineralIndustry) {
            cy.getByData(this?._selectors.ansMineralIndustry).click();
        } else if (context?.environmentalImpact?.isOtherProjects) {
            cy.getByData(this?._selectors.ansOtherProjects).click();
        } else if (context?.environmentalImpact?.isProductionProcessingOfMetals) {
            cy.getByData(this?._selectors.ansProductionProcessingOfMetals).click();
        } else if (context?.environmentalImpact?.isRubberIndustry) {
            cy.getByData(this?._selectors.ansRubberIndustry).click();
        } else if (context?.environmentalImpact?.isTextileIndustries) {
            cy.getByData(this?._selectors.ansTextileIndustries).click();
        } else if (context?.environmentalImpact?.isTourismLeisure) {
            cy.getByData(this?._selectors.ansTourismLeisure).click();
        }
        cy.advanceToNextPage();
    };
    selectAffectSensitiveArea(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.environmentalImpact?.isSensitiveArea) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.sensitiveAreaSensitiveAreaDetails).clear().type(lpaManageAppealsData?.environmentlImpact?.sensitiveAreaSensitiveAreaDetails);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
        }
        cy.advanceToNextPage();
    };

    selectThresholdOrCriteriaColumn2(context) {
        const basePage = new BasePage();
        if (context?.environmentalImpact?.isColumn2Threshold) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
        }
        cy.advanceToNextPage();
    };

    selectIssuedScreeningOpinion(context) {
        const basePage = new BasePage();
        if (context?.environmentalImpact?.isScreeningOpinion) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your screening opinion and any correspondence
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();
            this.selectScreeningOpinionEnvStmt(context);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectScreeningOpinionEnvStmt(context) {
        const basePage = new BasePage();
        if (context?.environmentalImpact?.isScreenOpenionEnvStmt) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectEnvironmentalImpactAsses(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.siteAccess?.isLpaSiteSafetyRisks) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteSafetyRisksLpaSiteSafetyRiskDetails).clear().type(lpaManageAppealsData?.siteAccess?.siteSafetyRiskDerails);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}