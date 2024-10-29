import { BasePage } from "../../../../page-objects/base-page";
export class AppealProcess {

    _selectors = {
       nearbyAppealReference:'#nearbyAppealReference',
       newConditionsNewConditionDetails:'#newConditions_newConditionDetails'
    }

    selectNearbyAppeals(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.appealProcess?.nearbyAppeals){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if($body.find(`.govuk-fieldset__heading:contains(${lpaQuestionnaireData?.appealProcess?.addAnotherAppeal})`).length > 0){
                    cy.getByData(basePage?._selectors.answerNo).click();
                     cy.advanceToNextPage();	
                } else {		
                    cy.get(this._selectors?.nearbyAppealReference).type(lpaQuestionnaireData?.appealProcess?.nearByAppealReference);
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            });
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
    selectNewConditionss(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.appealProcess?.newConditions){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.newConditionsNewConditionDetails).type(lpaQuestionnaireData?.appealProcess?.conditionsAndDetails)
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
}
