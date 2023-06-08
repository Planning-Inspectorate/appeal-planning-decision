import { BasePage } from '../../page-objects/base-page';
import { TypeOfPlanning } from '../../page-objects/appeals-sections/type-of-planning'
import { DateOfDecisionDue } from '../../page-objects/appeals-sections/date-decision-due';
import { EnterLpa } from '../../page-objects/before-you-start/select-lpa';

const basePage = new BasePage
const enterLpa = new EnterLpa
const typeOfPlanning = new TypeOfPlanning
const dateDecisionDue = new DateOfDecisionDue

beforeEach(() => {
    cy.clearAllSessionStorage();
});

describe('Before You Start', () => {
    it('should visit the appeals service url', () => {
        // Step 1: Vist the appeals service url
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);

        // Step 2: Validates that we are on the correct page
        basePage.verifyPageHeading('Before you start');
    });

    it('should select the contiune button', () => {
        // Step 3: Select the contiune button
        basePage.clickContinueBtn();
    });

    it('should enter a local planning authority and select contiune button', () => {
        // Step 4: Enters LPA name
        enterLpa.enterLPA('System Test Borough Council');

        // Step 5: Select LPA from the drop down list
        enterLpa.selectLPA();
        
        // Step 6: Select the contiune button
        basePage.clickSaveAndContiuneBtn();
    });
    
    it('should select type of planning application', () => {
        // Step 7: Select full planning appeal
       typeOfPlanning.selectFullPlanning();

       // Step 8: Select the contiune button
       basePage.clickSaveAndContiuneBtn();
    });

    it('should select the', () => { 
        // Step 9: Select the 'None of these' check-box
        basePage.selectCheckBox('none_of_these');

        // Step 10: Select the contiune button
       basePage.clickSaveAndContiuneBtn();
    });

    it('should select if granted, refused or no decision', () => {
        // Step 13: Select 'Granted' radio button
        basePage.selectRadioBtn('granted');
        
        // Step 12: Select the conitune button
        basePage.clickSaveAndContiuneBtn();
    });

    it('should enter a date within 6 months of today', () => {
        // need to change this!

        // Step 13: Enter day in the past
        dateDecisionDue.enterDayDate('01');

        // Step 14: Enter month in the past
        dateDecisionDue.enterMontDate('05');

        // Step 15: Enter this year
        dateDecisionDue.enterYearDate('2023');

        // Step 16: Select the contiune button
        basePage.clickSaveAndContiuneBtn();
    });

    it('should select if an enforcement notice has been recieved', () => {
        basePage.selectRadioBtn('no');
        basePage.clickSaveAndContiuneBtn();
    });

    it('should select  ', () => {
        
    });
});