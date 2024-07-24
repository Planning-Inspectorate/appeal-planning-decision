import { BasePage } from "../../../../page-objects/base-page";
export class OtherNewDocumentsPage{
    
    _selectors={
    }

    addOtherNewDocumentsData(context){
        const basePage = new BasePage();
        if(context?.uploadDocuments?.isOtherNewDocumentAvailable){
            //Do you have any other new documents that support your appeal?#
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();	
            //Upload your other new supporting documents
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadOtherNewSupportDoc);
            cy.advanceToNextPage();	
        } else{
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();
        }    
    };
   
}
