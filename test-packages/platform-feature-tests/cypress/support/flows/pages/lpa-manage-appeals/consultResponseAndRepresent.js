// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class ConsultResponseAndRepresent {

    _selectors = {
        statutoryConsulteesConsultedBodiesDetails: "#statutoryConsultees_consultedBodiesDetails"
    }

    selectStatutoryConsultees(context, lpaManageAppealsData) {
        const basePage = new BasePage();

        if (context?.consultResponseAndRepresent?.isStatutoryConsultees) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.get(this._selectors?.statutoryConsulteesConsultedBodiesDetails).clear();
            cy.get(this._selectors?.statutoryConsulteesConsultedBodiesDetails).type(lpaManageAppealsData?.consultResponseAndRepresent?.statutoryConsulteesConsultedBodiesDetails);
            cy.advanceToNextPage();            
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectConsultationResponses(context) {
        const basePage = new BasePage();
        if (context?.consultResponseAndRepresent?.isConsultationResponses) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the consultation responses and standing advice	
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadConsultationResponses);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    }
    
    selectOtherPartyRepresentations(context) {
        const basePage = new BasePage();
        if (context?.consultResponseAndRepresent?.isOtherPartyRepresentations) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the representations		
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadRepresentations);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
