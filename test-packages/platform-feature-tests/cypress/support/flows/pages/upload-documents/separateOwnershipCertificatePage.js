import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();
    if(context?.uploadDocuments?.haveSeparateOwnershipAndLandDecl){
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();	
        // //Upload your separate ownership certificate and agricultural land declaration
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadSeparateOwnershipCertAndAgricultureDoc);
        cy.advanceToNextPage();

    } else{
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();	

    }
    
    //Upload your appeal statement
    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
    cy.advanceToNextPage();    
};
