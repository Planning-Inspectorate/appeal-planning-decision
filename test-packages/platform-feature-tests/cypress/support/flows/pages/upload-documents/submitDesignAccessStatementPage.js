module.exports = (context) => {    
		if(context?.uploadDocuments?.isSubmitDesignAndAccessStmt){
			//Did you submit a design and access statement with your application?
			cy.get('[data-cy="answer-yes"]').click();
			cy.advanceToNextPage();
			//Upload your design and access statement
			cy.uploadFileFromFixtureDirectory('design-and-access-statement.pdf');
			cy.advanceToNextPage();
		} else{
			cy.get('[data-cy="answer-no"]').click();
			cy.advanceToNextPage();
		}
	
		//Upload your plans, drawings and supporting documents you submitted with your application
		cy.uploadFileFromFixtureDirectory('plans-drawings-and-supporting-documents.pdf');
		cy.advanceToNextPage();
};
