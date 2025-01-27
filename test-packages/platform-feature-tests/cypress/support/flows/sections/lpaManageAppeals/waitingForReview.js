/// <reference types="cypress"/>

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../../page-objects/base-page";

export const waitingForReview = (appealId)=>{
    const basePage = new BasePage();
    cy.get('#tab_waiting-for-review').click();   
    cy.get('a.govuk-link').contains(appealId).click();
    cy.get(`a[href*="/manage-appeals/${appealId}/appeal-details"]`).click();  
    cy.exec('del /q cypress\\downloads\\*');
    cy.window().then(win=>{
        cy.stub(win,'open').as('download')
    });
    cy.get(`a[href*="/manage-appeals/${appealId}/appeal-details?pdf=true"]`).click();    
    cy.waitUntil(()=>cy.task('isFileExist',`cypress/downloads/Appeal ${appealId}.pdf`),{
        timeout: 10000,
        interval: 500
    })
    basePage.backBtn();

    // cy.get('#tab_waiting-for-review').click();
    // cy.log(appealId);
    // cy.get('a.govuk-link').contains(appealId).click();
    cy.get(`a[href*="/manage-appeals/${appealId}/questionnaire"]`).click();  
    cy.exec('del /q cypress\\downloads\\*');
    cy.window().then(win=>{
        cy.stub(win,'open').as('download')
    });
    cy.get(`a[href*="/manage-appeals/${appealId}/questionnaire?pdf=true"]`).click();    
    cy.waitUntil(()=>cy.task('isFileExist',`cypress/downloads/Appeal Questionnaire ${appealId}.pdf`),{
        timeout: 10000,
        interval: 500
    })

    cy.get(`a[href*="/manage-appeals/${appealId}/download/back-office/documents/lpa-questionnaire"]`).click();    
    cy.waitUntil(()=>cy.task('isFileExist',`cypress/downloads/appeal_${appealId}_lpa-questionnaire`),{
        timeout: 100000,
        interval: 5000
    })
}