import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();
    if(context?.uploadDocuments?.isApplyAwardCost){
        //Do you need to apply for an award of appeal costs?
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
        //Upload your application for an award of appeal costs
        
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadApplicationForAppealCost);
        cy.advanceToNextPage();
    } else{
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    } 
};
