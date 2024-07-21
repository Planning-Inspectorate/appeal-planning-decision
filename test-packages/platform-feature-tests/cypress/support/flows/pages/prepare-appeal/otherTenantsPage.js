import { BasePage } from "../../../../page-objects/base-page";
module.exports = (anyOtherTenants,context) => {
    const basePage = new BasePage();
    
    if(anyOtherTenants){
        basePage.clickRadioBtn('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();  
    } else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  
    }
};