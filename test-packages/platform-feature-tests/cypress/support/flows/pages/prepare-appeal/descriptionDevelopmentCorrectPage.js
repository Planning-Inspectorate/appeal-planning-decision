import { DescriptionDevelopmentCorrect } from "../../../../page-objects/prepare-appeal/description-development-correct";
module.exports = () => {
    const descriptionDevelopmentCorrect = new DescriptionDevelopmentCorrect();
    descriptionDevelopmentCorrect.clickDescriptionDevelopmentCorrect('#updateDevelopmentDescription');        
    cy.advanceToNextPage();        
    
};