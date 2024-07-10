export class AgriculturalHolding  {
	agriculturalHoldingElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickAgriculturalHolding(agriculturalHolding) {
        this.agriculturalHoldingElements.clickRadioBtn(agriculturalHolding).click();
    }
}
