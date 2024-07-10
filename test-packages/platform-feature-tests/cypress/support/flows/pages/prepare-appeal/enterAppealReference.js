import { EnterAppealReference } from "../../../../page-objects/prepare-appeal/enter-appeal-reference";
module.exports = () => {
    const enterAppealReference = new EnterAppealReference();
    enterAppealReference.clickEnterAppealReference('#appellantLinkedCaseAdd-2');        
    cy.advanceToNextPage();     
    
};