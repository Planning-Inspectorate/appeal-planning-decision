import { ApplicationName } from "../../../../page-objects/prepare-appeal/application-name";
module.exports = (appellant) => {
    const applicationName = new ApplicationName();
	//cy.taskListComponent(applicationType,'application-name',dynamicId);
		//Was the application made in your name?(Ans:No)
    if(appellant) {
        applicationName.clickApplicationName('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
    }
    else{
        applicationName.clickApplicationName('[data-cy="answer-no"]');        
        cy.advanceToNextPage();
        applicationName.addApplicationNameField('#appellantFirstName','firstname');
        applicationName.addApplicationNameField('#appellantLastName','lastname');
  
        cy.advanceToNextPage();

    }
    
};
