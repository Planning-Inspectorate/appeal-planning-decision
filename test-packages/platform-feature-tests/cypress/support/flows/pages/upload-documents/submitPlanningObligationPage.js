module.exports = (context) => {
    if(context?.uploadDocuments?.submitPlanningObligation){
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();	
        if(context?.uploadDocuments?.finalisedPlanningStatus === "ready"){
            cy.get('[data-cy="answer-finalised"]').click();
            cy.advanceToNextPage();	   
            cy.uploadFileFromFixtureDirectory('additional-final-comments-2.pdf');
            cy.advanceToNextPage();         
        } else if(context?.uploadDocuments?.finalisedPlanningStatus === "draft"){
            cy.get('[data-cy="answer-draft"]').click();
            cy.advanceToNextPage();	   
            cy.uploadFileFromFixtureDirectory('additional-final-comments-2.pdf');
            cy.advanceToNextPage();         
        } else {
            cy.get('[data-cy="answer-not started yet"]').click();
            cy.advanceToNextPage();
        }     
      
    } else {
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();	
    }
    
};
