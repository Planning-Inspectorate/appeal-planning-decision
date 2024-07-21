
import { BasePage } from "../../../../page-objects/base-page";
module.exports = (applicationType,areaUnits,context) => {
    const basePage = new BasePage();
   
    if( applicationType === 'answer-householder-planning' && context?.statusOfOriginalApplication === 'refused') {
        basePage.addTextField('#siteAreaSquareMetres','10001'); 
        cy.advanceToNextPage();  
    }
    else {
        if(areaUnits === 'hectare'){           
           basePage.clickRadioBtn('[data-cy="answer-ha"]');
           basePage.addTextField('#siteAreaSquareMetres_hectares','10001');  
            cy.advanceToNextPage(); 
        }
        else {            
            basePage.clickRadioBtn('[data-cy="answer-m²"]');
            basePage.addTextField('#siteAreaSquareMetres_m²','10001'); 
            cy.advanceToNextPage(); 
        }
           
    }
};