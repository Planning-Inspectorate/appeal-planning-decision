// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class ProofsOfEvidence {
    _selectors = {
       
           }

    selectUploadProofEvidence(context) {        
        //Upload your proof of evidence and summary
        cy.uploadFileFromFixtureDirectories(context?.documents?.uploadProofEvidence);
        cy.advanceToNextPage();         
    };
    //Do you need to add any witnesses?

    selectAddWitnesses(context) {
        const basePage = new BasePage(); 

        if (context?.proofsOfEvidence?.isAddWitness) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload your witnesses and their evidence
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadWitnessesEvidence);
            cy.advanceToNextPage();  

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}