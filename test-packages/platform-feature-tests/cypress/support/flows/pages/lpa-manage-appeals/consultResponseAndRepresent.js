import { BasePage } from "../../../../page-objects/base-page";
export class ConsultResponseAndRepresent {

    _selectors = {
        statutoryConsulteesConsultedBodiesDetails:"#statutoryConsultees_consultedBodiesDetails"
    }

    selectStatutoryConsultees(context, lpaQuestionnaireData) {
        const basePage = new BasePage();

        if(context?.consultResponseAndRepresent?.isStatutoryConsultees){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.statutoryConsulteesConsultedBodiesDetails).clear().type(lpaQuestionnaireData?.consultResponseAndRepresent?.statutoryConsulteesConsultedBodiesDetails);
            cy.advanceToNextPage();
            //this.selectConsultationResponses(context);  
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();	
        }
    };
    selectConsultationResponses(context){
        const basePage = new BasePage();
        if(context?.consultResponseAndRepresent?.isConsultationResponses){
            cy.getByData(basePage?._selectors.answerYes).click();           
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Upload the consultation responses and standing advice
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();	
        }
    }
    
    selectOtherPartyRepresentations(context) {
        const basePage = new BasePage();

        if(context?.consultResponseAndRepresent?.isOtherPartyRepresentations){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Upload the representations
            cy.advanceToNextPage();    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();	
        }
    };
}
