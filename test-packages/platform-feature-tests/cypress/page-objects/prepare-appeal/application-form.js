export class ApplicationForm {
	applicationFormElements = {		
	applicationFormField:(fieldType)=> cy.get(fieldType),
    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    addApplicationFormField(fieldType,fieldValue){
        this.applicationFormElements.applicationFormField(fieldType).type(fieldValue);
    }
    
    clickAppellantType(appellant) {
        this.applicationFormElements.clickRadioBtn(appellant).click();
    }

	
}
