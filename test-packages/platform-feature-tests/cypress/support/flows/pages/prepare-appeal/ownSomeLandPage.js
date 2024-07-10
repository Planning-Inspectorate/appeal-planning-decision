import { OwnSomeLand } from "../../../../page-objects/prepare-appeal/own-some-land";
module.exports = () => {
    const ownSomeLand = new OwnSomeLand();
    ownSomeLand.clickOwnSomeLand('#ownsSomeLand-2');        
    cy.advanceToNextPage();        
    
};