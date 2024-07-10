import { ApplicantName } from "../../../../page-objects/prepare-appeal/applicant-name";
module.exports = () => {
    const applicantName = new ApplicantName();
	//cy.taskListComponent(applicationType,'application-name',dynamicId);
   
    applicantName.addApplicantNameField('#appellantFirstName','firstname');
    applicantName.addApplicantNameField('#appellantLastName','lastname');
    applicantName.addApplicantNameField('#appellantCompanyName','companyname')

    cy.advanceToNextPage();

    
};
