export class ContactDetails {
	contactDetailsElements = {		
    contactDetailsField:(fieldType)=> cy.get(fieldType),
    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    addContactDetailsField(fieldType,fieldValue){
        this.contactDetailsElements.contactDetailsField(fieldType).type(fieldValue);
    }
    
    clickAppellantType(appellant) {
        this.applicationFormElements.clickRadioBtn(appellant).click();
    }

	
}
