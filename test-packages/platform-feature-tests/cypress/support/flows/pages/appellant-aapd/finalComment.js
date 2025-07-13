// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page"
export class FinalComment {
    _selectors = {
    }
    selectSubmitAnyFinalComment(context) {
        const basePage = new BasePage();

        if (context?.submitFinalComments?.selectAnswer) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            // Add your Final Comments
            cy.get('#appellantFinalCommentDetails').clear();
            cy.get('#appellantFinalCommentDetails').type("Final comment test");
            cy.get('#sensitiveInformationCheckbox').check({ force: true });
            cy.advanceToNextPage();
            //Upload your witnesses and their evidence
            if (context?.additionalDocuments?.selectAnswer) {
                cy.getByData(basePage?._selectors?.answerYes).click();
                cy.advanceToNextPage();
                cy.get('body').then($body => {
                    if ($body.find('button[name="delete"]:contains("Remove")').length > 0) {
                        cy.contains('button[name="delete"]', 'Remove').click();
                    }
                });
                // cy.contains('button[name="delete"]','Remove',{timeout:0,log:false}).then($btn => {
                //     if ($btn.length > 0) {
                //         cy.wrap($btn).click();
                //     }
                // })
                cy.uploadFileFromFixtureDirectories(context?.documents?.uploadAdditionalDocsSupportFinalComments);
                cy.advanceToNextPage();
            } else {
                cy.getByData(basePage?._selectors?.answerNo).click();
                cy.advanceToNextPage();
            }

        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        //     cy.contains('button[name="delete"]','Remove',{timeout:0,log:false}).then($btn => {
        //         if ($btn.length > 0) {
        //             cy.advanceToNextPage();
        //         }
        //     })
        }
    };
}