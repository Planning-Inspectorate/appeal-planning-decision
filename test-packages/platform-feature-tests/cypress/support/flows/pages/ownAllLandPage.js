import { OwnAllLand } from "../../../page-objects/prepare-appeal/own-all-land";
module.exports = () => {
    const ownAllLand = new OwnAllLand();
    ownAllLand.clickOwnAllLand('#ownsAllLand-2');        
    cy.advanceToNextPage();        
    
};