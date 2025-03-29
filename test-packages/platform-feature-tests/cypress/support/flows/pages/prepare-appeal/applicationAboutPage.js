// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class ApplicationAboutPage {

    _selectors = {
        applicationAboutHouseholder: '[data-cy="answer-householder"]',
        applicationAboutChangeOfUse: '[data-cy="answer-change-of-use"]',
        applicationAboutMineralWorkings: '[data-cy="answer-mineral-workings"]',
        applicationAnswerDwellings: '[data-cy="answer-dwellings"]',
        applicationAnswerIndustryStorage: '[data-cy="answer-industry-storage"]',
        applicationAnswerOffices: '[data-cy="answer-offices"]',
        applicationAnswerRetailServices: '[data-cy="answer-retail-services"]',
        applicationAnswerTravellerCaravan: '[data-cy="answer-traveller-caravan"]',
        applicationAnswerOther: '[data-cy="answer-other"]'
    }

    addApplicationAboutData(applicationAbout) {
        const basePage = new BasePage();

        if (applicationAbout === 'householder') {
            basePage.clickRadioBtn(this._selectors.applicationAboutHouseholder);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'changeofuse') {
            basePage.clickRadioBtn(this._selectors.applicationAboutChangeOfUse);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'mineralworkings') {
            basePage.clickRadioBtn(this._selectors.applicationAboutMineralWorkings);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'dwellings') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerDwellings);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'industrystorage') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerIndustryStorage);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'offices') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerOffices);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'retailservices') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerRetailServices);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'travellercaravan') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerTravellerCaravan);
            cy.advanceToNextPage();
        }
        else if (applicationAbout === 'other') {
            basePage.clickRadioBtn(this._selectors.applicationAnswerOther);
            cy.advanceToNextPage();
        }
    };
}