import { BasePage } from "../../../../page-objects/base-page";
export class SubmitPlanningObligationPage{

    _selectors={
    }

    addSubmitPlanningObligationData(context){
        const basePage = new BasePage();  
        if(context?.uploadDocuments?.submitPlanningObligation){
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();	
            if(context?.uploadDocuments?.finalisedPlanningStatus === "ready"){
                basePage.clickRadioBtn('[data-cy="answer-finalised"]');
                cy.advanceToNextPage();	   
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFinalisingDocReady);
                cy.advanceToNextPage();         
            } else if(context?.uploadDocuments?.finalisedPlanningStatus === "draft"){
                basePage.clickRadioBtn('[data-cy="answer-draft');
                cy.advanceToNextPage();	   
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFinalisingDocDraft);
                cy.advanceToNextPage();         
            } else {
                basePage.clickRadioBtn('[data-cy="answer-not started yet"]');
                cy.advanceToNextPage();
            }     
        
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();	
        }
    };
   
}
