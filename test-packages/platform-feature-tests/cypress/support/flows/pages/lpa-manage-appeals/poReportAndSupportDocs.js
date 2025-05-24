// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../support/flows/sections/dateService";
export class PoReportAndSupportDocs {

    _selectors = {
        infrastructureLevyAdoptedDateDay: '#infrastructureLevyAdoptedDate_day',
        infrastructureLevyAdoptedDateMonth: '#infrastructureLevyAdoptedDate_month',
        infrastructureLevyAdoptedDateYear: '#infrastructureLevyAdoptedDate_year',
        infrastructureLevyExpectedDateDay: '#infrastructureLevyExpectedDate_day',
        infrastructureLevyExpectedDateMonth: '#infrastructureLevyExpectedDate_month',
        infrastructureLevyExpectedDateYear: '#infrastructureLevyExpectedDate_year'
    }
    selectPOReportAndSupportDocsHas(context) {
        cy.uploadFileFromFixtureDirectories(context?.documents?.uploadPoReportDecisionNotice);
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories(context?.documents?.uploadPlansDrawings);
        cy.advanceToNextPage();
        //     cy.uploadFileFromFixtureDirectories(context?.documents?.uploadDevelopmentPlanPolicies);
        //     cy.advanceToNextPage();
    };
    selectPOReportAndSupportDocsS78(context) {
        //Upload the planning officer’s report or what your decision notice would have said
        cy.uploadFileFromFixtureDirectories(context?.documents?.uploadPoReportDecisionNotice);
        cy.advanceToNextPage();
        //Upload relevant policies from your statutory development plan
        // cy.uploadFileFromFixtureDirectories(context?.documents?.uploadDevelopmentPlanPolicies);
        // cy.advanceToNextPage();
    };
    selectStatuorydevelopmentplan(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isSelectStatuaryPlan) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadEmergingPlan);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    }
    selectEmergingPlansHas(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isEmergingPlan) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadEmergingPlan);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectEmergingPlansS78(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isEmergingPlan) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the emerging plan and supporting information
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadEmergingPlan);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
        //Upload any other relevant policies
        //  cy.uploadFileFromFixtureDirectories(context?.documents?.uploadOtherPolicies);
        //  cy.advanceToNextPage();
    };

    selectOtherRelevantPolicies(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isOtherRelaventPolicies) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the emerging plan and supporting information
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadEmergingPlan);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
        //Upload any other relevant policies
        // cy.uploadFileFromFixtureDirectories(context?.documents?.uploadOtherPolicies);
        // cy.advanceToNextPage();
    };

    selectSupplementaryPlanningDocs(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isSupplementaryPlanningDocs) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload relevant policy extracts and supplementary planning documents
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadSupplementaryPlanningDocs);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectCommunityInfraLevy(context) {
        const basePage = new BasePage();
        if (context?.poReportAndSupportDocs?.isCommunityInfrastructureLevy) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your community infrastructure levy
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadCommunityInfrastructureLevy)
            cy.advanceToNextPage();
            this.selectCommunityInfraLevyAdopted(context);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectCommunityInfraLevyAdopted(context) {
        const basePage = new BasePage();
        const date = new DateService();
        if (context?.poReportAndSupportDocs?.isCommunityInfrastructureLevyAdopted) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateDay).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateDay).type(date.today());
            cy.get(this._selectors?.infrastructureLevyAdoptedDateMonth).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateMonth).type(date.currentMonth());
            cy.get(this._selectors?.infrastructureLevyAdoptedDateYear).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateYear).type(date.currentYear());
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateDay).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateDay).type(date.today());
            cy.get(this._selectors?.infrastructureLevyAdoptedDateMonth).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateMonth).type(date.currentMonth());
            cy.get(this._selectors?.infrastructureLevyAdoptedDateYear).clear();
            cy.get(this._selectors?.infrastructureLevyAdoptedDateYear).type(date.nextYear());
            cy.advanceToNextPage();
        }
    };
}
