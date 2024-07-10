import { GreenBelt } from "../../../../page-objects/prepare-appeal/green-belt";
module.exports = (appellantInGreenBelt) => {
    const greenbelt = new GreenBelt();
    if(appellantInGreenBelt){
        greenbelt.clickAppellantGreenBelt('[data-cy="answer-yes"]');        
        cy.advanceToNextPage(); 
    } else {
//Is the appeal site in a green belt?Ans:No
        greenbelt.clickAppellantGreenBelt('[data-cy="answer-no"]');        
        cy.advanceToNextPage(); 
    }

	       
      
};