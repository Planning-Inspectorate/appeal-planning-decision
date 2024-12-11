// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../base-page";
import { TaskList } from "./task-list";

const basePage = new BasePage();
const taskList = new TaskList(); 

export class AppealStatement {
    uploadAppealStatement() {
        taskList.clickAppealDocumentsSectionDataLink();
        basePage.fileUpload('cypress/fixtures/appeal-statement-valid.pdf');
        basePage.selectCheckBox();
        basePage.clickSaveAndContiuneBtn();   
    }

    plansOrdrawings(option) {
        if (option === 'yes') {
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
            basePage.fileUpload('cypress/fixtures/plans-drawings-and-supporting-documents.pdf');
            basePage.clickSaveAndContiuneBtn();
        }
        else {
            basePage.selectRadioBtn('no');
            basePage.clickSaveAndContiuneBtn();
        }
    }

    planningObligation(option) {
        if (option === 'yes') {
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
        }
        else {
            basePage.selectRadioBtn('no');
            basePage.clickSaveAndContiuneBtn();
        }
    }

    statusOfPlanningObligation(option) {
        if (option === 'Finalised') {
            basePage.selectRadioBtn('finalised');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'planning-obligation');
            basePage.fileUpload('cypress/fixtures/planning-obligation.pdf');
            basePage.clickSaveAndContiuneBtn();
        }

        else if (option === 'Draft') {
            basePage.selectRadioBtn('finalised');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'planning-obligation');
            basePage.fileUpload('cypress/fixtures/planning-obligation.pdf');
            basePage.clickSaveAndContiuneBtn();
        }

        else if (option === 'Not Started') {
            basePage.selectRadioBtn('not_started');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'planning-obligation-deadline');
            basePage.clickSaveAndContiuneBtn();
        }

    }

    newDocuments(option){
        if (option === 'Yes') {
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'other-supporting-documents');
            basePage.fileUpload('cypress/fixtures/other-supporting-docs.pdf');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', '/task-list');
        }
        else if (option === 'No') {
            basePage.selectRadioBtn('no');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', '/task-list');
        }
    }
}