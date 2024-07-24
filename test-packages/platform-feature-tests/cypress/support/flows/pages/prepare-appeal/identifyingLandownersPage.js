import { BasePage } from "../../../../page-objects/base-page";
export class IdentifyingLandownersPage{

    _selectors={
    }

    addIdentifyingLandownersData(){
        const basePage = new BasePage();
    
        basePage.clickCheckBox('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();  
    };
   
}