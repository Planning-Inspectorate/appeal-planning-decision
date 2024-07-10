import { ApplicationForm } from "../../../../page-objects/prepare-appeal/application-form";
module.exports = (applicationType,appellant,dynamicId) => {
    const applicationForm = new ApplicationForm();
	cy.taskListComponent(applicationType,'application-name',dynamicId);
   // cy.advanceToNextPage();
		//Was the application made in your name?(Ans:No)
    // if(appellant === 'Myself' ) {

    // }
    // else{
    //     applicationForm.clickAppellantType('#isAppellant-2');        
    //     cy.advanceToNextPage();
    //     applicationForm.addApplicationFormField('#appellantFirstName','firstname');
    //     applicationForm.addApplicationFormField('#appellantLastName','lastname');
  
    //     cy.advanceToNextPage();

    // }
    
};
