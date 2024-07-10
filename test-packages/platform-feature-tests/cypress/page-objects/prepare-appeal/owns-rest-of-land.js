export class OwnsRestOfLand {
	ownsRestOfLandElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickOwnsRestOfLand(ownsRestOfLand) {
        this.ownsRestOfLandElements.clickRadioBtn(ownsRestOfLand).click();
    }
}
