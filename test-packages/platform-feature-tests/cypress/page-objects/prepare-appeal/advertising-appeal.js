export class AdvertisingAppeal {
	advertisingAppealElements = {
        checkBox: () => cy.get('[data-cy="answer-yes"]')};	

    checkAdvertisingAppeal(advertisedAppeal) {
        this.advertisingAppealElements.checkBox(advertisedAppeal).check();    
    }
 };