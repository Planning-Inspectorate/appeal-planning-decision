export class WhyPreferHearing {
	whyPreferHearingElements = {		
        whyPreferHearingField:(fieldType)=> cy.get(fieldType)};
	
    addWhyPreferHearingField(fieldType,fieldValue){
        this.whyPreferHearingElements.whyPreferHearingField(fieldType).type(fieldValue);
    }    
    	
}
