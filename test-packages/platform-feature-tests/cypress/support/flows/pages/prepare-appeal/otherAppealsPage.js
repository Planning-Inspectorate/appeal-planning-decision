import { EnterAppealReference } from "../../../../page-objects/prepare-appeal/enter-appeal-reference";
import { OtherAppeals } from "../../../../page-objects/prepare-appeal/other-appeals";
const enterAppealReference = require('./enterAppealReferencePage');
//const { enterAppealReference } from  ""
module.exports = (anyOtherAppeals,context) => {
    const otherAppeals = new OtherAppeals();
    const enterAppealReference = new EnterAppealReference();
    if(anyOtherAppeals){       
        for(let otherAppeal of context?.otherAppeals){
            otherAppeals.clickOtherAppeals('[data-cy="answer-yes"]');        
            cy.advanceToNextPage(); 
            enterAppealReference.addEnterReferenceField('#appellantLinkedCase', otherAppeal?.appealReferenceNumber);
            cy.advanceToNextPage();            
        }   
        otherAppeals.clickOtherAppeals('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  

    } else {       
        otherAppeals.clickOtherAppeals('[data-cy="answer-no"]');        
        cy.advanceToNextPage();  
    }    
};
