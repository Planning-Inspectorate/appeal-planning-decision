// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class R6FullAppealsStatement {
    _selectors = {
       
           }

    selectUploadStatement(context) {        
        //Upload your proof of evidence and summary
        cy.uploadFileFromFixtureDirectories(context?.documents?.uploadStatement);
        cy.advanceToNextPage();         
    };
    //Do you need to add any witnesses?

    selectAddWitnesses(context) {
        const basePage = new BasePage(); 

        if (context?.statement?.isAddWitness) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your witnesses and their evidence
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadWitnessesStatement);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}