// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from './base-page';
import { EnterLpa } from './before-you-start/select-lpa';
import { TypeOfPlanning } from './before-you-start/type-of-planning';
import { DateOfDecisionDue } from './before-you-start/date-decision-due';

const basePage = new BasePage();
const enterLpa = new EnterLpa();
const typeOfPlanning = new TypeOfPlanning();
const dateDecisionDue = new DateOfDecisionDue();

export class BeforeYouStart {
	fullPlanning() {
		cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
		basePage.acceptCookies();
		basePage.verifyPageHeading('Before you start');
		basePage.clickContinueBtn();
		enterLpa.enterLPA('System Test Borough Council');
		enterLpa.selectLPA();
		basePage.clickSaveAndContiuneBtn();
		typeOfPlanning.selectFullPlanning();
		basePage.clickSaveAndContiuneBtn();
		basePage.selectCheckBox('none_of_these');
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('granted'); // can choose all 3 with full planning
		basePage.clickSaveAndContiuneBtn();
		dateDecisionDue.enterDayDate();
		dateDecisionDue.enterMontDate();
		dateDecisionDue.enterYearDate();
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('no');
		basePage.clickSaveAndContiuneBtn();
		basePage.verifyPageHeading('You can appeal using this service');
	}

	houseHolder() {
		cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
		basePage.acceptCookies();
		basePage.verifyPageHeading('Before you start');
		basePage.clickContinueBtn();
		enterLpa.enterLPA('System Test Borough Council');
		enterLpa.selectLPA();
		basePage.clickSaveAndContiuneBtn();
		typeOfPlanning.selectHouseHolderPlanning();
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('no');
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('granted'); // has to be refused or takes your down the full planning route
		basePage.clickSaveAndContiuneBtn();
		dateDecisionDue.enterDayDate();
		dateDecisionDue.enterMontDate();
		dateDecisionDue.enterYearDate();
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('no');
		basePage.clickSaveAndContiuneBtn();
		basePage.verifyPageHeading('You can appeal using this service');
	}

	casPlanning() {
		cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
		basePage.acceptCookies();
		basePage.verifyPageHeading('Before you start');
		basePage.clickContinueBtn();
		enterLpa.enterLPA('System Test Borough Council');
		enterLpa.selectLPA();
		basePage.clickSaveAndContiuneBtn();
		typeOfPlanning.selectcasPlanning();//new item for cas
		basePage.clickSaveAndContiuneBtn();
		basePage.selectCheckBox('none_of_these');
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('granted'); // can choose all 3 with full planning
		basePage.clickSaveAndContiuneBtn();
		dateDecisionDue.enterDayDate();
		dateDecisionDue.enterMontDate();
		dateDecisionDue.enterYearDate();
		basePage.clickSaveAndContiuneBtn();
		basePage.selectRadioBtn('no');
		basePage.clickSaveAndContiuneBtn();
		basePage.verifyPageHeading('You can appeal using this service');
	}
}
