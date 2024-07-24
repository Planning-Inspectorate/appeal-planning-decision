import { BasePage } from "../../../../page-objects/base-page";

export class HowManyWitnessesPage{
    
    _selectors={
        appellantPreferInquiryWitnesses:'#appellantPreferInquiryWitnesses'
    }

    addHowManyWitnessesData(isAgriculturalHolding,context){
        const basePage = new BasePage();
   	   
        //How many days would you expect the inquiry to last?
        basePage.addTextField(this._selectors?.appellantPreferInquiryWitnesses,'30');
        cy.advanceToNextPage();  
    };
   
}