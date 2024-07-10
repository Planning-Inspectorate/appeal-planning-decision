export class ReferenceNumber {
	referenceNumberElements = {		
    referenceNumberField:(fieldType)=> cy.get(fieldType)};
	
    addReferenceNumber(fieldType,fieldValue){
        this.referenceNumberElements.referenceNumberField(fieldType).type(fieldValue);
    }    
    	
}
