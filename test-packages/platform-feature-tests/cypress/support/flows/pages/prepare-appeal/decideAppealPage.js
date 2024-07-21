import { BasePage } from "../../../../page-objects/base-page";
const otherAppeals = require('./otherAppealsPage');

module.exports = (appellantProcedurePreference,context) => {

    const basePage = new BasePage();
      
    if(appellantProcedurePreference === 'written'){
        basePage.clickRadioBtn('[data-cy="answer-written"]'); 
        cy.advanceToNextPage();        
    }else {
        if(appellantProcedurePreference === 'hearing'){
            basePage.clickRadioBtn('[data-cy="answer-hearing"]');  
            cy.advanceToNextPage();
            basePage.addTextField('#appellantPreferHearingDetails','Test why prefer hearing testproperty123456789aAbcdEF!"£$%QA');                      
            cy.advanceToNextPage();
        }else if(appellantProcedurePreference === 'inquiry') {
            basePage.clickRadioBtn('[data-cy="answer-inquiry"]'); 
            cy.advanceToNextPage();
            basePage.addTextField('#appellantPreferInquiryDetails','Test why prefer inquiry testproperewrwe5454354rty12345dfdfder6789aAbcdEF!"£$%QA'); 
            cy.advanceToNextPage();
            basePage.addTextField('#appellantPreferInquiryDuration','50');
            cy.advanceToNextPage();
            basePage.addTextField('#appellantPreferInquiryWitnesses','10');
            cy.advanceToNextPage();       
           
        }
        
    }
};