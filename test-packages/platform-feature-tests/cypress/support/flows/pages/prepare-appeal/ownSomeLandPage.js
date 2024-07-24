import { BasePage } from "../../../../page-objects/base-page";
const { OwnsRestOfLandPage } = require("./ownsRestOfLandPage");
const { OwnsLandInvolvedPage } = require("./ownsLandInvolvedPage")
const ownsRestOfLandPage = new OwnsRestOfLandPage();
const ownsLandInvolvedPage = new OwnsLandInvolvedPage();
export class OwnSomeLandPage{
    _selectors={
    }

    addOwnSomeLandData(isOwnsSomeLand,context){
        const basePage = new BasePage();
   
        if(isOwnsSomeLand){    
            basePage.clickRadioBtn('[data-cy="answer-yes"]');     
            cy.advanceToNextPage();
         
            ownsRestOfLandPage.addOwnsRestOfLandgData(context?.applicationForm?.knowsOtherOwners);
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');     
            cy.advanceToNextPage(); 
    
            ownsLandInvolvedPage.addOwnsLandInvolvedData(context?.applicationForm?.knowsAllOwners);
            
        }  
    };
   
}