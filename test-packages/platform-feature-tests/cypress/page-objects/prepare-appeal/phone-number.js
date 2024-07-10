export class PhoneNumber {
	phoneNumberElements = {		
    phoneNumberField:(fieldType)=> cy.get(fieldType)};
	
    addPhoneNumberField(fieldType,fieldValue){
        this.phoneNumberElements.phoneNumberField(fieldType).type(fieldValue);
    }    
    	
}
