export class TellingLandowners {
	tellingLandownersElements = {
        checkBox: () => cy.get('[data-cy="answer-yes"]')};	

    checkTellingLandowners(informedOwners) {
        this.tellingLandownersElements.checkBox().check(informedOwners);    
    }
 };