import { BasePage } from "../../../../page-objects/base-page";
module.exports = (isAppellantLinkedCaseAdd) => {
    const basePage = new BasePage();
   
    if(isAppellantLinkedCaseAdd){
        basePage.clickRadioBtn('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
    } else {      
        basePage.clickRadioBtn('[data-cy="answer-no"]');        
        cy.advanceToNextPage(); 
    }     
};