export class IdentifyingLandowners {
	identifyingLandownersElements = {
        checkBox: () => cy.get('[data-cy="answer-yes"]')};	

    checkIdentifyingLandowners(identifiedOwners) {
        this.identifyingLandownersElements.checkBox().check(identifiedOwners);    
    }
 };