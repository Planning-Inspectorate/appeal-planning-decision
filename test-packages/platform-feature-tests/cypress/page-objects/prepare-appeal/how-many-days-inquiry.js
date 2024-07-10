export class HowManyDaysInquiry {
	howManyDaysInquiryElements = {		
        howManyDaysInquiryField:(fieldType)=> cy.get(fieldType)};
	
    addHowManyDaysInquiryField(fieldType,fieldValue){
        this.howManyDaysInquiryElements.howManyDaysInquiryField(fieldType).type(fieldValue);
    }	
}
