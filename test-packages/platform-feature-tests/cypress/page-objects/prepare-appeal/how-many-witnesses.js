export class HowManyWitnesses {
	howManyWitnessesElements = {		
        howManyWitnessesField:(fieldType)=> cy.get(fieldType)};
	
    addHowManyWitnessesField(fieldType,fieldValue){
        this.howManyWitnessesElements.howManyWitnessesField(fieldType).type(fieldValue);
    }	
}
