import { BasePage } from "../../../../page-objects/base-page";

const ownsRestOfLand = require('./ownsRestOfLandPage');
const ownsLandInvolved = require('./ownsLandInvolvedPage');

module.exports = (isOwnsSomeLand,context) => {
    const basePage = new BasePage();
   
    if(isOwnsSomeLand){    
        basePage.clickRadioBtn('[data-cy="answer-yes"]');     
        cy.advanceToNextPage();
     
        ownsRestOfLand(context?.applicationForm?.knowsOtherOwners);
    } else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');     
        cy.advanceToNextPage(); 

        ownsLandInvolved(context?.applicationForm?.knowsAllOwners);
        
    } 
    
};