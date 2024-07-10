import { OtherAppeals } from "../../../../page-objects/prepare-appeal/other-appeals";
module.exports = () => {
    const otherAppeals = new OtherAppeals();
    otherAppeals.clickOtherAppeals('#appellantLinkedCase');        
    cy.advanceToNextPage();        
    
};