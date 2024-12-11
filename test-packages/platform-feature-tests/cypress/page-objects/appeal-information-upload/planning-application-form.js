// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../base-page";
import { TaskList } from "./task-list";

const basePage = new BasePage();
const taskList = new TaskList();

// To be completed, Yes for all options.

export class PlanningApplicationForm {
    uploadPlanningForm() {
        taskList.clickPlanningApplicationDocumentsSectionLink();
        basePage.fileUpload('cypress/fixtures/planning-application-form.pdf');
        basePage.clickSaveAndContiuneBtn();
    }
  
    agriculturalLandOwnership(option) {
        if (option === 'yes') {
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'certificates');
            basePage.fileUpload('cypress/fixtures/ownership-certificate-and-agricultural-land-declaration.pdf');
            basePage.clickContinueBtn();
        } else {
            basePage.selectRadioBtn('no');
            basePage.clickSaveAndContiuneBtn();
        }
     }

     descriptionOfDevelopment(option) {
        if (option === 'no'){
            basePage.selectRadioBtn('no');
            basePage.enterTextArea('test');
            basePage.clickSaveAndContiuneBtn();
        } else {
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
        }
     }

     supportingDocuments() {
        basePage.fileUpload('cypress/fixtures/plans-drawings-and-supporting-documents.pdf');
        basePage.clickSaveAndContiuneBtn();
     }
    
    designAccessStatement(option) {
        if (option === 'yes'){
            basePage.selectRadioBtn('yes');
            basePage.clickSaveAndContiuneBtn();
            cy.url().should('include', 'design-access-statement');
            basePage.fileUpload('cypress/fixtures/design-and-access-statement.pdf');
            basePage.clickSaveAndContiuneBtn();
        } else {
            basePage.selectRadioBtn('no');
            basePage.clickContinueBtn();
        }
    }

    decisionLetter(){
        cy.url().should('include', 'decision-letter');
        basePage.fileUpload('');
        basePage.clickSaveAndContiuneBtn();
    }

}