import { BasePage } from "../../../../page-objects/base-page";
export class SiteAccess {
    _selectors = {
       lpaSiteAccessLpaSiteAccessDetails: '#lpaSiteAccess_lpaSiteAccessDetails',
       neighbourSiteAccessNeighbourSiteAccessDetails: '#neighbourSiteAccess_neighbourSiteAccessDetails',
       addressLineOne:'#address-line-1',
       addressLineTwo:'#address-line-2',
       addressTown:'#address-town',
       addressCounty:'#address-county',
       addressPostcode:'#address-postcode',
       lpaSiteSafetyRisksLpaSiteSafetyRiskDetails:'#lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails'
    }

    selectLpaSiteAccess(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.siteAccess?.lpaSiteAccess){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteAccessLpaSiteAccessDetails).type(lpaQuestionnaireData?.siteAccess?.siteAccessInformation);
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };

    selectNeighbourSiteAccess(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.siteAccess?.neighbourSiteAccess){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.neighbourSiteAccessNeighbourSiteAccessDetails).type(lpaQuestionnaireData?.siteAccess?.neighbourSiteAccess)
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if($body.find(`.govuk-fieldset__heading:contains(${lpaQuestionnaireData?.siteAccess?.anotherNeighbourVisit})`).length > 0){
                    cy.getByData(basePage?._selectors.answerNo).click();
                     cy.advanceToNextPage();	
                } else {
                    cy.get(this._selectors?.addressLineOne).type(lpaQuestionnaireData?.siteAccess?.addresssLineOne);
                    cy.get(this._selectors?.addressLineTwo).type(lpaQuestionnaireData?.siteAccess?.addresssLineTwo);
                    cy.get(this._selectors?.addressTown).type(lpaQuestionnaireData?.siteAccess?.addresssTown);				
                    cy.get(this._selectors?.addressCounty).type(lpaQuestionnaireData?.siteAccess?.addressCounty);
                    cy.get(this._selectors?.addressPostcode).type(lpaQuestionnaireData?.siteAccess?.addressPostCode);
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                     cy.advanceToNextPage();	
                }
            })
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
    selectLpaSiteSafetyRisks(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.siteAccess?.lpaSiteSafetyRisks){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteSafetyRisksLpaSiteSafetyRiskDetails).clear().type(lpaQuestionnaireData?.siteAccess?.siteSafetyRiskDerails);
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
}