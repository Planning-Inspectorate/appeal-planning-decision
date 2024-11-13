import { BasePage } from "../../../../page-objects/base-page";
export class EnvImpactAssess {
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

    selectScheduleType(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.siteAccess?.isLpaSiteAccess){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteAccessLpaSiteAccessDetails).type(lpaQuestionnaireData?.siteAccess?.siteAccessInformation);
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };

    selectIssuedScreeningOption(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.siteAccess?.isNeighbourSiteAccess){
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
    selectEnvironmentalImpactAsses(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.siteAccess?.isLpaSiteSafetyRisks){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteSafetyRisksLpaSiteSafetyRiskDetails).clear().type(lpaQuestionnaireData?.siteAccess?.siteSafetyRiskDerails);
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
}