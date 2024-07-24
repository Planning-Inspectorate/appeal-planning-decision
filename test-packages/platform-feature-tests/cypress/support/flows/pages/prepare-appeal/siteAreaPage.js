
import { BasePage } from "../../../../page-objects/base-page";
export class SiteAreaPage{
    
    _selectors={
        siteAreaSquareMetres:'#siteAreaSquareMetres',
        siteAreaSquareMetresHectares:'#siteAreaSquareMetres_hectares',
        siteAreaSquareMetresMSauare:'#siteAreaSquareMetres_m²',
        siteAreaUnitsHectares:'[data-cy="answer-ha"]',
        siteAreaUnitsMetres:'[data-cy="answer-m²"]'
    }

    addSiteAreaData(applicationType,areaUnits,context){
        const basePage = new BasePage();
   
        if( applicationType === 'answer-householder-planning' && context?.statusOfOriginalApplication === 'refused') {
            basePage.addTextField(this._selectors?.siteAreaSquareMetres,'10001'); 
            cy.advanceToNextPage();  
        }
        else {
            if(areaUnits === 'hectare'){           
            basePage.clickRadioBtn(this._selectors?.siteAreaUnitsHectares);
            basePage.addTextField(this._selectors?.siteAreaSquareMetresHectares,'10001');  
                cy.advanceToNextPage(); 
            }
            else {            
                basePage.clickRadioBtn(this._selectors?.siteAreaUnitsMetres);
                basePage.addTextField(this._selectors?.siteAreaSquareMetresMSauare,'10001'); 
                cy.advanceToNextPage(); 
            }
            
        }
    };
   
}