import { DecideAppeal } from "../../../../page-objects/prepare-appeal/decide-appeal";
import { WhyPreferHearing } from "../../../../page-objects/prepare-appeal/why-prefer-hearing";
import { WhyPreferInquiry } from "../../../../page-objects/prepare-appeal/why-prefer-inquiry";
import { HowManyDaysInquiry } from "../../../../page-objects/prepare-appeal/how-many-days-inquiry";
import { HowManyWitnesses } from "../../../../page-objects/prepare-appeal/how-many-witnesses";
const otherAppeals = require('./otherAppealsPage');

module.exports = (appellantProcedurePreference,context) => {

    const decideAppeal = new DecideAppeal();
    const whyPreferHearing = new WhyPreferHearing();
    const whyPreferInquiry = new WhyPreferInquiry();
    const howManyDaysInquiry = new HowManyDaysInquiry();
    const howManyWitnesses = new HowManyWitnesses();
  
    if(appellantProcedurePreference === 'written'){
        decideAppeal.clickDecideAppeal('[data-cy="answer-written"]'); 
        cy.advanceToNextPage();        
    }else {
        if(appellantProcedurePreference === 'hearing'){
            decideAppeal.clickDecideAppeal('[data-cy="answer-hearing"]');  
            cy.advanceToNextPage();
            whyPreferHearing.addWhyPreferHearingField('#appellantPreferHearingDetails','Test why prefer hearing testproperty123456789aAbcdEF!"£$%QA');                      
            cy.advanceToNextPage();
        }else if(appellantProcedurePreference === 'inquiry') {
            decideAppeal.clickDecideAppeal('[data-cy="answer-inquiry"]'); 
            cy.advanceToNextPage();
            whyPreferInquiry.addWhyPreferInquiryField('#appellantPreferInquiryDetails','Test why prefer inquiry testproperewrwe5454354rty12345dfdfder6789aAbcdEF!"£$%QA'); 
            cy.advanceToNextPage();
            howManyDaysInquiry.addHowManyDaysInquiryField('#appellantPreferInquiryDuration','50');
            cy.advanceToNextPage();
            howManyWitnesses.addHowManyWitnessesField('#appellantPreferInquiryWitnesses','10');
            cy.advanceToNextPage();       
           
        }
        
    }
};