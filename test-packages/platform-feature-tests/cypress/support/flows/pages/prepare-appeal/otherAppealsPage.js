import { BasePage } from "../../../../page-objects/base-page";
export class OtherAppealsPage{
    
    _selectors={
        appellantLinkedCase:'#appellantLinkedCase'
    }

    addOtherAppealsData(anyOtherAppeals,context){
        const basePage = new BasePage();
    
        if(anyOtherAppeals){       
            for(let otherAppeal of context?.otherAppeals){
                basePage.clickRadioBtn('[data-cy="answer-yes"]');        
                cy.advanceToNextPage();
    
                basePage.addTextField(this._selectors?.appellantLinkedCase, otherAppeal?.appealReferenceNumber);          
                cy.advanceToNextPage();            
            }   
            basePage.clickRadioBtn('[data-cy="answer-no"]');        
            cy.advanceToNextPage();  
    
        } else {       
            basePage.clickRadioBtn('[data-cy="answer-no"]');        
            cy.advanceToNextPage();  
        }    
    };
   
}
