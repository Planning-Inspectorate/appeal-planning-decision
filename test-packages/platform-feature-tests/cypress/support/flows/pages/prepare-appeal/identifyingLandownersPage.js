import { IdentifyingLandowners } from "../../../../page-objects/prepare-appeal/identifying-landowners";
module.exports = () => {
    const identifyingLandowners = new IdentifyingLandowners();
    identifyingLandowners.checkIdentifyingLandowners('[data-cy="answer-yes"]');        
    cy.advanceToNextPage();        
    
};