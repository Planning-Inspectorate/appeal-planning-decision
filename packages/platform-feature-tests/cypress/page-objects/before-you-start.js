import { BasePage } from "./base-page";
import { EnterLpa } from "./before-you-start/select-lpa";
import { TypeOfPlanning } from "./before-you-start/type-of-planning";
import { DateOfDecisionDue } from "./before-you-start/date-decision-due";

const basePage = new BasePage
const enterLpa = new EnterLpa
const typeOfPlanning = new TypeOfPlanning
const dateDecisionDue = new DateOfDecisionDue

export class BeforeYouStart {

    beforeYouStartFullPlanning() {
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        basePage.verifyPageHeading('Before you start');
        basePage.clickContinueBtn();
        enterLpa.enterLPA('System Test Borough Council');
        enterLpa.selectLPA();
        basePage.clickSaveAndContiuneBtn();
        typeOfPlanning.selectFullPlanning();
        basePage.clickSaveAndContiuneBtn();
        basePage.selectCheckBox('none_of_these');
        basePage.clickSaveAndContiuneBtn();
        basePage.selectRadioBtn('granted');
        basePage.clickSaveAndContiuneBtn();
        dateDecisionDue.enterDayDate('01');
        dateDecisionDue.enterMontDate('05');
        dateDecisionDue.enterYearDate('2023');
        basePage.clickSaveAndContiuneBtn();
        basePage.selectRadioBtn('no');
        basePage.clickSaveAndContiuneBtn();
        basePage.verifyPageHeading('You can appeal using this service');
    }


    beforeYouStartHouseHolder() {
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        basePage.verifyPageHeading('Before you start');
        basePage.clickContinueBtn();
        enterLpa.enterLPA('System Test Borough Council');
        enterLpa.selectLPA();
        basePage.clickSaveAndContiuneBtn();
        typeOfPlanning.selectHouseHolderPlanning();
        basePage.clickSaveAndContiuneBtn();
        basePage.selectRadioBtn('no');
        basePage.clickSaveAndContiuneBtn();
        basePage.selectRadioBtn('granted');
        basePage.clickSaveAndContiuneBtn();
        dateDecisionDue.enterDayDate('01');
        dateDecisionDue.enterMontDate('05');
        dateDecisionDue.enterYearDate('2023');
        basePage.clickSaveAndContiuneBtn();
        basePage.selectRadioBtn('no');
        basePage.clickSaveAndContiuneBtn();
        basePage.verifyPageHeading('You can appeal using this service');
    }
}