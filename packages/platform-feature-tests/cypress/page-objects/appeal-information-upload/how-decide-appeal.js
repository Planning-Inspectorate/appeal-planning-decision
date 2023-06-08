import { BasePage } from "../base-page"
import { TaskList } from "./task-list";

const basePage = new BasePage
const taskList = new TaskList

export class DecideAppeal {
    elements = {
        writtenRepresentation: () => cy.get('[data-cy="answer-written-representation"]'),
        hearing: () => cy.get('[data-cy="answer-hearing"]'),
        inquiry: () => cy.get('[data-cy="answer-inquiry"]'),
        daysInput: () => cy.get('#expected-days')
    }
    
    AppealType(appealType){
        taskList.clickAppealDecisionSectionLink()
            if (appealType === 'Written') {
                this.elements.writtenRepresentation().check();
                basePage.clickSaveAndContiuneBtn();
            }
            else if (appealType === 'Hearing') {
                this.elements.hearing().check();
                basePage.enterTextArea('test');
                basePage.clickSaveAndContiuneBtn();
                // TODO: Add Upload
            }
            else if (appealType === 'Inquiry') {
                this.elements.inquiry().check();
                basePage.clickSaveAndContiuneBtn();
                basePage.enterTextArea('test');
                basePage.clickSaveAndContiuneBtn();
                this.elements.daysInput().clear().type('10')
                basePage.clickSaveAndContiuneBtn();
                // TODO: Add Upload
            }
        }
}
