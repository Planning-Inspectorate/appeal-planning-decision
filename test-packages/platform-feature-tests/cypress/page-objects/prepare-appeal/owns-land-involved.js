export class OwnsLandInvolved {
	ownsLandInvolvedElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickOwnsLandInvolved(ownsLandInvolved) {
        this.ownsLandInvolvedElements.clickRadioBtn(ownsLandInvolved).click();
    }
}
