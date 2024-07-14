import { OwnSomeLand } from "../../../../page-objects/prepare-appeal/own-some-land";
//import { OwnsLandInvolved } from "../../../../page-objects/prepare-appeal/owns-land-involved";
//import { ownsRestOfLand } from "./ownsRestofLand"
const ownsRestOfLand = require('./ownsRestOfLandPage');
const ownsLandInvolved = require('./ownsLandInvolvedPage');

module.exports = (isOwnsSomeLand,context) => {
    const ownSomeLand = new OwnSomeLand();
    //const ownsRestOfLand = new OwnsRestOfLand();
   // const ownsLandInvolvedPage = new OwnsLandInvolved();
    if(isOwnsSomeLand){    
        ownSomeLand.clickOwnSomeLand('[data-cy="answer-yes"]');     
        cy.advanceToNextPage();

     //   ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-yes"]')
        ownsRestOfLand(context?.applicationForm?.knowsOtherOwners);
    } else {
        ownSomeLand.clickOwnSomeLand('[data-cy="answer-no"]');     
        cy.advanceToNextPage(); 
        ownsLandInvolved(context?.applicationForm?.knowsAllOwners)
        //ownsLandInvolvedPage.clickOwnsLandInvolved('[data-cy="answer-yes"]');
    } 
    
};