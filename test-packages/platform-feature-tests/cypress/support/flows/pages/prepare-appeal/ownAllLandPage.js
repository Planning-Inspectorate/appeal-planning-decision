import { OwnAllLand } from "../../../../page-objects/prepare-appeal/own-all-land";

module.exports = (isOwnsAllLand) => {
    const ownAllLand = new OwnAllLand();
    if(isOwnsAllLand){
        //Do you own all the land involved in the appeal?Ans:No
        ownAllLand.clickOwnAllLand('[data-cy="answer-yes"]');        
        cy.advanceToNextPage(); 
    } else {
        //Do you own all the land involved in the appeal?Ans:No
        ownAllLand.clickOwnAllLand('[data-cy="answer-no"]');        
        cy.advanceToNextPage(); 

    }           
    
};