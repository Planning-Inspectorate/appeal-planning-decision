export class TenantAgriculturalHolding  {
	tenantAgriculturalHoldingElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickTenantAgriculturalHolding(tenantAgriculturalHolding) {
        this.tenantAgriculturalHoldingElements.clickRadioBtn(tenantAgriculturalHolding).click();
    }
}
