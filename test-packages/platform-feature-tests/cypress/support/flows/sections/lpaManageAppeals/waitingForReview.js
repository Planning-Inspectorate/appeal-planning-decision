/// <reference types="cypress"/>

export const waitingForReview = (appealId)=>{
    cy.get('#tab_waiting-for-review').click();
    cy.log(appealId);
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
}