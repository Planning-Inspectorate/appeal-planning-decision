import { BasePage } from "../../../../page-objects/base-page";

export class HowManyDaysInquiryPage{
    
    _selectors={
        appellantPreferInquiryDuration:'#appellantPreferInquiryDuration'
    }

    addHowManyDaysInquirygData(){
        const basePage = new BasePage();
    
        //How many days would you expect the inquiry to last?
        basePage.addTextField(this._selectors?.appellantPreferInquiryDuration,'30');
        cy.advanceToNextPage();   
    };
   
}