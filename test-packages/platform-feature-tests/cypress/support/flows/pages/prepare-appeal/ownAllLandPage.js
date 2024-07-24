import { BasePage } from "../../../../page-objects/base-page";
export class OwnAllLandPage{

    _selectors={
    }

    addOwnAllLandData(isOwnsAllLand){
        const basePage = new BasePage();   

        if(isOwnsAllLand){
            //Do you own all the land involved in the appeal?Ans:yes
            basePage.clickRadioBtn('[data-cy="answer-yes"]');       
            cy.advanceToNextPage();       
    
        } else {
            //Do you own all the land involved in the appeal?Ans:No
            basePage.clickRadioBtn('[data-cy="answer-no"]');        
            cy.advanceToNextPage();
           
        }     
    };
   
}