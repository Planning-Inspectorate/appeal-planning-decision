import { BasePage } from "../../../../page-objects/base-page";
export class PoReportAndSupportDocs {

    _selectors = {
       
    }
    selectPOReportAndSupportDocs(context) {
        const basePage = new BasePage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();           
    };    
    selectEmergingPlans(context) {
        const basePage = new BasePage();
        if(context?.poReportAndSupportDocs?.isEmergingPlan){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');  
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
    selectSupplementaryPlanningDocs(context) {
        const basePage = new BasePage();
        if(context?.poReportAndSupportDocs?.isSupplementaryPlanningDocs){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf'); 
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
}
