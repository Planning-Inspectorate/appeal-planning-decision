
import { BasePage } from "../../../../page-objects/base-page";
import { SiteArea } from "../../../../page-objects/prepare-appeal/site-area";
module.exports = (applicationType,areaUnits,context) => {
    const siteArea = new SiteArea();
    if( applicationType === 'answer-householder-planning' && context?.statusOfOriginalApplication === 'refused') {
    //if( applicationType === 'householder' ) {
        siteArea.addSiteAreaField('#siteAreaSquareMetres','10001'); 
        cy.advanceToNextPage();  
    }
    else {
        if(areaUnits === 'hectare'){
            siteArea.clickRadioBtn('[data-cy="answer-ha"]');
            siteArea.addSiteAreaField('#siteAreaSquareMetres_hectares','10001'); 
            cy.advanceToNextPage(); 
        }
        else {
            siteArea.clickRadioBtn('[data-cy="answer-m²"]');
            siteArea.addSiteAreaField('#siteAreaSquareMetres_m²','10001'); 
            cy.advanceToNextPage(); 

        }
           
    }
};