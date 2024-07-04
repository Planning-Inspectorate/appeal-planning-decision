export class OwnAllLand {
	ownAllLandElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickOwnAllLand(ownAllLand) {
        this.ownAllLandElements.clickRadioBtn(ownAllLand).click();
    }
}
