export class ApplicationDate {
	applicationDateElements = {		
    applicationDateField:(fieldType)=> cy.get(fieldType)};
	
    addApplicationDateField(fieldType,fieldValue){
        this.applicationDateElements.applicationDateField(fieldType).type(fieldValue);
    }    
    	
}
