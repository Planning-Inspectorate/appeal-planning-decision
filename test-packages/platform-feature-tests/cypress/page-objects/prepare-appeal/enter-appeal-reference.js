export class EnterAppealReference {
	enterAppealReferenceElements = {
        clickRadioBtn:(radioId) =>cy.get(radioId),
        enterReferenceFeild:(fieldType)=> cy.get(fieldType)	};       

    clickOtherAppeals(appellantLinkedCaseAdd) {
        this.enterAppealReferenceElements.clickRadioBtn(appellantLinkedCaseAdd).click();    
    }

    addEnterReferenceField(fieldType,fieldValue){
        this.enterAppealReferenceElements.enterReferenceFeild(fieldType).type(fieldValue);
    }

 };