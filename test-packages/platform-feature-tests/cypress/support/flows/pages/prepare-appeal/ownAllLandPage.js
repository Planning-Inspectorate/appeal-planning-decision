import { OwnAllLand } from "../../../../page-objects/prepare-appeal/own-all-land";
import {AgriculturalHolding } from "../../../../page-objects/prepare-appeal/agricultural-holding";
import { OwnSomeLand } from "../../../../page-objects/prepare-appeal/own-some-land";

module.exports = (isOwnsAllLand) => {
    const ownAllLand = new OwnAllLand();
    const agriculturalHolding = new AgriculturalHolding();
    const ownSomeLand = new OwnSomeLand()

    if(isOwnsAllLand){
        //Do you own all the land involved in the appeal?Ans:yes
        ownAllLand.clickOwnAllLand('[data-cy="answer-yes"]');        
        cy.advanceToNextPage();
        agriculturalHolding.clickAgriculturalHolding('[data-cy="answer-yes"]');
        cy.advanceToNextPage();

    } else {
        //Do you own all the land involved in the appeal?Ans:No
        ownAllLand.clickOwnAllLand('[data-cy="answer-no"]');        
        cy.advanceToNextPage();
        //ownSomeLand.clickOwnSomeLand('[data-cy="answer-yes"]'); 
       // cy.advanceToNextPage();

    }           
    
};