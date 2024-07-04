export class GreenBelt {
	greenBeltElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickAppellantGreenBelt(appellantGreenBelt) {
        this.greenBeltElements.clickRadioBtn(appellantGreenBelt).click();
    }
}
