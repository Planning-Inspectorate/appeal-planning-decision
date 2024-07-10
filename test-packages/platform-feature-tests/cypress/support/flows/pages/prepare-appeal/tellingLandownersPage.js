import { TellingLandowners } from "../../../../page-objects/prepare-appeal/telling-landowners";
module.exports = () => {
    const tellingLandowners = new TellingLandowners();
    tellingLandowners.checkTellingLandowners('#informedOwners');        
    cy.advanceToNextPage();  
    
};