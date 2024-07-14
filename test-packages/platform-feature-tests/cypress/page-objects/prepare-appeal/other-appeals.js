export class OtherAppeals {
	otherAppealsElements = {
        clickRadioBtn:(radioId) =>cy.get(radioId)	};	

    clickOtherAppeals(appellantLinkedCase) {
        this.otherAppealsElements.clickRadioBtn(appellantLinkedCase).click();    
    }
 };

