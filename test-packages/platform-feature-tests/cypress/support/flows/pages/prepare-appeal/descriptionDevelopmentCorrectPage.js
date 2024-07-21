import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
   
    basePage.clickRadioBtn('#updateDevelopmentDescription');        
    cy.advanceToNextPage();        
    
};