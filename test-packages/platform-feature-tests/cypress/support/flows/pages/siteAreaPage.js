
import { BasePage } from "../../../page-objects/base-page";
import { SiteArea } from "../../../page-objects/prepare-appeal/site-area";
module.exports = (applicationType) => {
    const siteArea = new SiteArea();
    if( applicationType === 'householder' ) {
        siteArea.addSiteAreaField('#siteAreaSquareMetres','10001'); 
        cy.advanceToNextPage();  
    }
    else{
    siteArea.clickRadioBtn('[data-cy="answer-m²"]');
    siteArea.addSiteAreaField('#siteAreaSquareMetres_m²','10001'); 
    cy.advanceToNextPage();    
    }
};


