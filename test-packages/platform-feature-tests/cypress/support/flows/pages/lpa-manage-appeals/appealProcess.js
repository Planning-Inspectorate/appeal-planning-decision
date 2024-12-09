import { BasePage } from "../../../../page-objects/base-page";
export class AppealProcess {

    _selectors = {
       nearbyAppealReference:'#nearbyAppealReference',
       newConditionsNewConditionDetails:'#newConditions_newConditionDetails',
       answerWritten:'answer-written',
       answerHearing:'answer-hearing',
       answerInquiry:'answer-inquiry',
       lpaPreferHearingDetails:'lpaPreferHearingDetails',
       lpaProcedurePreferenceLpaPreferInquiryDuration:'lpaProcedurePreference_lpaPreferInquiryDuration',
       lpaPreferInquiryDetails:'lpaPreferInquiryDetails'
    }
    selectProcedureType(context,lpaQuestionnaireData) {
        //const basePage = new BasePage();
        if(context?.appealProcess?.isProcedureType==='written'){
            cy.getByData(this?._selectors.answerWritten).click();
            cy.advanceToNextPage();
        } else if(context?.appealProcess?.isProcedureType==='hearing') {
            cy.getByData(this?._selectors.answerHearing).click();
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferHearingDetails).type(lpaQuestionnaireData?.appealProcess?.lpaPreferHearingDetails)
            cy.advanceToNextPage();
        } else if(context?.appealProcess?.isProcedureType==='inquiry') {
            cy.getByData(this?._selectors.answerInquiry).click();
            cy.get(this._selectors?.lpaProcedurePreferenceLpaPreferInquiryDuration).type(lpaQuestionnaireData?.appealProcess?.lpaProcedurePreferenceLpaPreferInquiryDuration)
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferInquiryDetails).type(lpaQuestionnaireData?.appealProcess?.lpaPreferInquiryDetails)
            cy.advanceToNextPage();            
        }
    };
    selectOngoingAppealsNextToSite(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.appealProcess?.isOngoingAppeals){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage(); 
            this.selectNearbyAppeals(context,lpaQuestionnaireData);   
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };

    selectNearbyAppeals(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        if(context?.appealProcess?.isNearbyAppeals){
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
    selectNewConditions(context,lpaQuestionnaireData){
        const basePage = new BasePage();
        if(context?.appealProcess?.isNewConditions){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.newConditionsNewConditionDetails).type(lpaQuestionnaireData?.appealProcess?.conditionsAndDetails)
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();		
        }
    };
}
