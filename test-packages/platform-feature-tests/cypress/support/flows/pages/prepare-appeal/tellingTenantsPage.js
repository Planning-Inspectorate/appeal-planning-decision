import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
   
    basePage.clickCheckBox('#informedTenantsAgriculturalHolding');  
          
    cy.advanceToNextPage();        
    
};