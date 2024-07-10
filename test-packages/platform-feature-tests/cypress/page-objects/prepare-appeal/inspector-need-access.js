export class InspectorNeedAccess {
	inspectorNeedAccessElements = {	
    clickRadioBtn:(radioId) =>cy.get(radioId),		
    inspectorNeedAccessField:(fieldType)=> cy.get(fieldType) };
	
    clickRadioBtn(buttonType) {
        this.inspectorNeedAccessElements.clickRadioBtn(buttonType).click();
    }

    addInspectorNeedAccessField(fieldType,fieldValue){
        this.inspectorNeedAccessElements.inspectorNeedAccessField(fieldType).type(fieldValue);
    }

  

}
