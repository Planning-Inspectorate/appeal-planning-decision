module.exports = (context) => {
    if(context?.uploadDocuments?.isNewPlanOrDrawingAvailable){
        //Do you have any new plans or drawings that support your appeal?
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();	
            //Upload your new plans or drawings
        cy.uploadFileFromFixtureDirectory('plans-drawings.jpeg');
        cy.advanceToNextPage();		
    } else{
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
    }
};
