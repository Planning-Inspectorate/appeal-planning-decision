export class SiteArea {
	siteAreaElements = {	
    clickRadioBtn:(radioId) =>cy.get(radioId),		
    siteAreaField:(fieldType)=> cy.get(fieldType) };
	
    clickRadioBtn(buttonType) {
        this.siteAreaElements.clickRadioBtn(buttonType).click();
    }

    addSiteAreaField(fieldType,fieldValue){
        this.siteAreaElements.siteAreaField(fieldType).type(fieldValue);
    }

  

}
