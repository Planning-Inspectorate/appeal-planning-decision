export class AppealSiteAddress {
	appealSiteAddressElements = {		
    appealSiteAddressField:(fieldType)=> cy.get(fieldType) };
	
    addAppealSiteAddressField(fieldType,fieldValue){
        this.appealSiteAddressElements.appealSiteAddressField(fieldType).type(fieldValue);
    }
   
}
