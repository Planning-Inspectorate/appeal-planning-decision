module.exports = (context) => {
    if(context?.uploadDocuments?.isOtherNewDocumentAvailable){
        //Do you have any other new documents that support your appeal?#
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();	
        //Upload your other new supporting documents
        cy.uploadFileFromFixtureDirectory('other-supporting-docs.pdf');
        cy.advanceToNextPage();	
    } else{
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
    }	
};
