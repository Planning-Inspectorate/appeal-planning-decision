import { BasePage } from "../../../../page-objects/base-page";
export class ConstraintsAndDesignations {
    _selectors = {
       affectedListedBuildingNumber:'#affectedListedBuildingNumber',
       changedListedBuildingNumber:'#changedListedBuildingNumber',
       designatedSitesSSSI:'#designatedSites',
       designatedSites2cSAC:'#designatedSites-2',
       designatedSites3SAC:'#designatedSites-3',
       designatedSites4pSPA:'#designatedSites-4',
       designatedSites5SPA:'#designatedSites-5',
       designatedSites6other:'#designatedSites-6',
       conditionalDesignatedSites6other:'#designatedSites_otherDesignations',
       designatedSites8no:'#designatedSites-8'
    }
    selectCorrectTypeOfAppeal(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isCorrectTypeOfAppeal){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectChangesListedBuilding(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isChangesListedBuilding){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if($body.find(`.govuk-fieldset__heading:contains(${lpaQuestionnaireData?.constraintsAndDesignations?.addChangedListedBuilding})`).length > 0){
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.changedListedBuildingNumber).type(lpaQuestionnaireData?.constraintsAndDesignations?.changedListedBuildingNumber)
                    cy.advanceToNextPage();		
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            })
        }else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }        
    };
    selectAffectListedBuildings(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isAffectListedBuildings){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if($body.find(`.govuk-fieldset__heading:contains(${lpaQuestionnaireData?.constraintsAndDesignations?.addAnotherBuilding})`).length > 0){
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();	
                } else {
                    cy.get(this._selectors?.affectedListedBuildingNumber).type(lpaQuestionnaireData?.constraintsAndDesignations?.listedBuildingNumber)
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
    selectScheduledMonument(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isAffectScheduleMonument){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectConservationArea(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isConservationArea){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectProtectedSpecies(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isProtectedSpecies){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            // cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            // cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectGreenBelt(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isGreenBelt){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            //cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            //cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
           // cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
           // cy.advanceToNextPage();	
        }
    };
    selectAreaOfOutstandingNaturalBeauty(context, lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isAreaOutstandingBeauty){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
        if(context?.constraintsAndDesignations?.isAllDesignatedSite){
            basePage.clickCheckBox(this._selectors?.designatedSitesSSSI);
            basePage.clickCheckBox(this._selectors?.designatedSites2cSAC);
            basePage.clickCheckBox(this._selectors?.designatedSites3SAC);
            basePage.clickCheckBox(this._selectors?.designatedSites4pSPA);
            basePage.clickCheckBox(this._selectors?.designatedSites5SPA);
            cy.get(this._selectors?.designatedSites6other).then(($checkbox)=>{
                if(!$checkbox.is(':checked')){
                    basePage.clickCheckBox(this._selectors?.designatedSites6other);
                }
            });
            basePage.addTextField(this._selectors?.conditionalDesignatedSites6other,lpaQuestionnaireData?.constraintsAndDesignations?.designatedSitesOtherDesignations);
        } else {
            basePage.clickCheckBox(this._selectors?.designatedSites8no);
        } 
        cy.advanceToNextPage();
    };

    selectTreePreservationOrder(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isTreePreservationOrder){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectGypsyTraveller(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isGypsyTraveller){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();            
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectPublicRightOfWay(context) {
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isPublicRightOfWay){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();            
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };    
}
