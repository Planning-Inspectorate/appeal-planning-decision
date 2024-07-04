import { OwnsLandInvolved } from "../../../page-objects/prepare-appeal/owns-land-involved";
module.exports = () => {
    const ownsLandInvolved = new OwnsLandInvolved();
    ownsLandInvolved.clickOwnsLandInvolved('#knowsAllOwners-2');        
    cy.advanceToNextPage();        
    
};