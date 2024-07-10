export class EnterAppealReference {
	enterAppealReferenceElements = {
        clickRadioBtn:(radioId) =>cy.get(radioId)	};	

    clickOtherAppeals(appellantLinkedCaseAdd) {
        this.enterAppealReferenceElements.clickRadioBtn(appellantLinkedCaseAdd).click();
    
    }
 };

