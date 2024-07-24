import { BasePage } from "../../../../page-objects/base-page";
export class GreenBeltPage{

    _selectors={
    }

    addGreenBeltData(appellantInGreenBelt){
        const basePage = new BasePage();
    
        if(appellantInGreenBelt){
            basePage.clickRadioBtn('[data-cy="answer-yes"]');        
            cy.advanceToNextPage(); 
        } else {
    //Is the appeal site in a green belt?Ans:No
            basePage.clickRadioBtn('[data-cy="answer-no"]');        
            cy.advanceToNextPage(); 
        }    
    };
   
}