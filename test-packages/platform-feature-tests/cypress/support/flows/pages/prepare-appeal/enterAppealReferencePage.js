import { EnterAppealReference } from "../../../../page-objects/prepare-appeal/enter-appeal-reference";
module.exports = (isAppellantLinkedCaseAdd) => {
    const enterAppealReference = new EnterAppealReference();
    if(isAppellantLinkedCaseAdd){
        enterAppealReference.clickEnterAppealReference('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
    } else {      
        enterAppealReference.clickEnterAppealReference('[data-cy="answer-no"]');        
        cy.advanceToNextPage(); 
    }     
};