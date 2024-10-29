import { BasePage } from "../../../../page-objects/base-page";
export class ConstraintsAndDesignations {
    _selectors = {
       affectedListedBuildingNumber:'#affectedListedBuildingNumber'
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
    selectAffectListedBuildings(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.affectListedBuildings){
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
    selectConservationArea(context){
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.conservationArea){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectIsGreenBelt(context){
        const basePage = new BasePage();
        if(context?.constraintsAndDesignations?.isGreenBelt){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();	
        }
    };
}
