export class WhyPreferInquiry {
	whyPreferInquiryElements = {		
        whyPreferInquiryField:(fieldType)=> cy.get(fieldType)};
	
    addWhyPreferInquiryField(fieldType,fieldValue){
        this.whyPreferInquiryElements.whyPreferInquiryField(fieldType).type(fieldValue);
    }    
    	
}
