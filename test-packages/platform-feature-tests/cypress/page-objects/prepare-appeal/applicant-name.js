export class ApplicantName {
	applicantNameElements = {		
	applicantNameField:(fieldType)=> cy.get(fieldType)   };    
	
    addApplicantNameField(fieldType,fieldValue){
         this.applicantNameElements.applicantNameField(fieldType).type(fieldValue);
     }    
}
