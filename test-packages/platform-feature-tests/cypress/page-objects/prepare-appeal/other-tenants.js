export class OtherTenants {
	otherTenantsElements = {
        clickRadioBtn:(radioId) =>cy.get(radioId)	};	

    clickOtherTenants(otherTenantsAgriculturalHolding) {
        this.otherTenantsElements.clickRadioBtn(otherTenantsAgriculturalHolding).click();
    
    }
 };

