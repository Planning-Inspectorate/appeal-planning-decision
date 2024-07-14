module.exports = (context) => {
    if(context?.uploadDocuments?.isApplyAwardCost){
        //Do you need to apply for an award of appeal costs?
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();
        //Upload your application for an award of appeal costs
        cy.uploadFileFromFixtureDirectory('other-supporting-docs.pdf');
        cy.advanceToNextPage();
    } else{
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
    } 
};
