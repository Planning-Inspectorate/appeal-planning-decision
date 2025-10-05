/// <reference types="cypress"/>

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../../page-objects/base-page";

export const waitingForReview = (appealId) => {
    const basePage = new BasePage();
    cy.get('#tab_waiting-for-review').click();
    cy.reload();
    cy.get('a.govuk-link').contains(appealId).click();
    cy.get(`a[href*="/manage-appeals/${appealId}/appeal-details"]`).click();
    cy.task('deleteFolder', 'cypress/downloads');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });
    cy.get(`a[href*="/manage-appeals/${appealId}/appeal-details?pdf=true"]`).click();
    cy.verifyDownload(`Appeal ${appealId}.pdf`, { contains: true });
    basePage.backBtn();
    cy.get(`a[href*="/manage-appeals/${appealId}/questionnaire"]`).click();
    cy.task('deleteFolder', 'cypress/downloads');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });
    cy.get(`a[href*="/manage-appeals/${appealId}/questionnaire?pdf=true"]`).click();
    cy.verifyDownload(`Appeal Questionnaire ${appealId}.pdf`, { contains: true });
    cy.get(`a[href*="/manage-appeals/${appealId}/download/back-office/documents/lpa-questionnaire"]`).click();
    cy.verifyDownload(`appeal_${appealId}_lpa-questionnaire`, { contains: true });
}