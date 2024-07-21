
import { BasePage } from "../../../../page-objects/base-page";
module.exports = (isInspectorNeedAccess) => {
    const basePage = new BasePage();
    
    //Will an inspector need to access your land or property?  Ans:Yes
    if(isInspectorNeedAccess){
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        basePage.addTextField('#appellantSiteAccess_appellantSiteAccessDetails','the appeal site is at the rear of a terraced property123456789aAbcdEF!"£$%QA'); 
        cy.advanceToNextPage();
    } else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');        
        cy.advanceToNextPage();

    }

      
    
};