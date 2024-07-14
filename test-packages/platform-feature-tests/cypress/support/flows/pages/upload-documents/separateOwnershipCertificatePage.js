module.exports = (context) => {
    if(context?.uploadDocuments?.haveSeparateOwnershipAndLandDecl){
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();	
        // //Upload your separate ownership certificate and agricultural land declaration
        cy.uploadFileFromFixtureDirectory('draft-planning-obligation.pdf');
        cy.advanceToNextPage();

    } else{
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();	

    }
    
    //Upload your appeal statement
    cy.uploadFileFromFixtureDirectory('appeal-statement-valid.pdf');
    cy.advanceToNextPage();    
};
