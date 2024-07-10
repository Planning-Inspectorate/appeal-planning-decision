export class TellingTenants {
	tellingTenantsElements = {      
        checkBox: () => cy.get('[data-cy="answer-yes"]')};	

    checkTellingTenants(informedTenantsAgriculturalHolding) {       
        this.tellingTenantsElements.checkBox().check(informedTenantsAgriculturalHolding);    
    }
 };