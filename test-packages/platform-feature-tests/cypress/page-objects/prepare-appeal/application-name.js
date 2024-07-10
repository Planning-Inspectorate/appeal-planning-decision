export class ApplicationName {
	applicationNameElements = {		
	applicationNameField:(fieldType)=> cy.get(fieldType),
    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	    
    addApplicationNameField(fieldType,fieldValue){
        this.applicationNameElements.applicationNameField(fieldType).type(fieldValue);
    }
    
    clickApplicationName(appellant) {
        this.applicationNameElements.clickRadioBtn(appellant).click();
    }

	
}
