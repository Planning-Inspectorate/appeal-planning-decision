import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();
    if(context?.uploadDocuments?.isNewPlanOrDrawingAvailable){
        //Do you have any new plans or drawings that support your appeal?
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();	
            //Upload your new plans or drawings
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadNewPlanOrDrawing);
        cy.advanceToNextPage();		
    } else{
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    }
};
