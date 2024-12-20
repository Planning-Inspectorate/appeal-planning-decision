// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class SiteAccess {
    _selectors = {
        lpaSiteAccessLpaSiteAccessDetails: '#lpaSiteAccess_lpaSiteAccessDetails',
        neighbourSiteAccessNeighbourSiteAccessDetails: '#neighbourSiteAccess_neighbourSiteAccessDetails',
        addressLine1Details: '#address-line-1',
        addressLine2Details: '#address-line-2',
        addressTownDetails: '#address-town',
        addressCountyDetails: '#address-county',
        addressPostCodeDetails: '#address-postcode',
        lpaSiteSafetyRisksLpaSiteSafetyRiskDetails: '#lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails'
    }

    selectLpaSiteAccess(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.siteAccess?.isLpaSiteAccess) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteAccessLpaSiteAccessDetails).type(lpaManageAppealsData?.siteAccess?.siteAccessInformation);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectNeighbourSiteAccess(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.siteAccess?.isNeighbourSiteAccess) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.neighbourSiteAccessNeighbourSiteAccessDetails).type(lpaManageAppealsData?.siteAccess?.neighbourSiteAccess)
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if ($body.find(`.govuk-fieldset__heading:contains(${lpaManageAppealsData?.siteAccess?.anotherNeighbourVisit})`).length > 0) {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.addressLine1Details).type(lpaManageAppealsData?.siteAccess?.addresssLineOne);
                    cy.get(this._selectors?.addressLine2Details).type(lpaManageAppealsData?.siteAccess?.addresssLineTwo);
                    cy.get(this._selectors?.addressTownDetails).type(lpaManageAppealsData?.siteAccess?.addresssTown);
                    cy.get(this._selectors?.addressCountyDetails).type(lpaManageAppealsData?.siteAccess?.addressCounty);
                    cy.get(this._selectors?.addressPostCodeDetails).type(lpaManageAppealsData?.siteAccess?.addressPostCode);
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
    selectLpaSiteSafetyRisks(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.siteAccess?.isLpaSiteSafetyRisks) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.lpaSiteSafetyRisksLpaSiteSafetyRiskDetails).clear();
            cy.get(this._selectors?.lpaSiteSafetyRisksLpaSiteSafetyRiskDetails).type(lpaManageAppealsData?.siteAccess?.siteSafetyRiskDerails);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}