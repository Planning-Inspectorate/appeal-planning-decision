export class UploadApplicationFormPage{

    _selectors={
    }

    addUploadApplicationFormData(context, dynamicId){
        //Upload your application form
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlanningApplConfirmLetter);
        cy.advanceToNextPage();
        if(context?.applicationForm?.iaUpdateDevelopmentDescription){
            //Upload evidence of your agreement to change the description of development
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDevelopmentDescription);
            cy.advanceToNextPage();
        }
        
        if(context?.statusOfOriginalApplication !== 'no decision'){
            cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDecisionLetter);
            cy.advanceToNextPage();
        }   
    };
   
}
