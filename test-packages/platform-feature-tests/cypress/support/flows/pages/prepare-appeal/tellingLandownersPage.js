import { TellingLandowners } from "../../../../page-objects/prepare-appeal/telling-landowners";
module.exports = () => {
    const tellingLandowners = new TellingLandowners();
    tellingLandowners.checktellingLandowners('#informedOwners');        
    cy.advanceToNextPage();  
    
};