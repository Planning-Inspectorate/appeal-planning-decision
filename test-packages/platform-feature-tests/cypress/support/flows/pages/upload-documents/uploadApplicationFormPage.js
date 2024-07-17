module.exports = (context, dynamicId) => {
   
		
		//Upload your application form
		cy.uploadFileFromFixtureDirectory('letter-confirming-planning-application.pdf');
		cy.advanceToNextPage();
		if(context?.applicationForm?.iaUpdateDevelopmentDescription){
			//Upload evidence of your agreement to change the description of development
			cy.uploadFileFromFixtureDirectory('additional-final-comments-1.pdf');
			cy.advanceToNextPage();
		}
		
		if(context?.statusOfOriginalApplication !== 'no decision'){
			cy.uploadFileFromFixtureDirectory('decision-letter.pdf');
		cy.advanceToNextPage();
		}
};
