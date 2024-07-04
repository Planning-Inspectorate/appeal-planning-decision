export class OwnSomeLand {
	ownSomeLandElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickOwnSomeLand(ownSomeLand) {
        this.ownSomeLandElements.clickRadioBtn(ownSomeLand).click();
    }
}
