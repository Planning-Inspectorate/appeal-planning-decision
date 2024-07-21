import { BasePage } from "../../../../page-objects/base-page";

module.exports = (anyOtherAppeals,context) => {
    const basePage = new BasePage();
    
    if(anyOtherAppeals){       
        for(let otherAppeal of context?.otherAppeals){
            basePage.clickRadioBtn('[data-cy="answer-yes"]');        
            cy.advanceToNextPage();

            basePage.addTextField('#appellantLinkedCase', otherAppeal?.appealReferenceNumber);          
            cy.advanceToNextPage();            
        }   
        basePage.clickRadioBtn('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  

    } else {       
        basePage.clickRadioBtn('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  
    }    
};
