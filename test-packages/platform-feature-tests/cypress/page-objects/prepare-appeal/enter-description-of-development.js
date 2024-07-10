export class EnterDescriptionOfDevelopment {
	enterDescriptionOfDevelopmentElements = {		
    enterDescriptionOfDevelopmentField:(fieldType)=> cy.get(fieldType)};
	
    addEnterDescriptionOfDevelopmentField(fieldType,fieldValue){
        this.enterDescriptionOfDevelopmentElements.enterDescriptionOfDevelopmentField(fieldType).type(fieldValue);
    }    
    	
}
