// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from '../base-page';
import { TaskList } from './task-list';

const basePage = new BasePage();
const taskList = new TaskList();

export class DecideAppeal {
	elements = {
		writtenRepresentation: () => cy.get('[data-cy="answer-written-representation"]'),
		hearing: () => cy.get('[data-cy="answer-hearing"]'),
		inquiry: () => cy.get('[data-cy="answer-inquiry"]'),
		daysInput: () => cy.get('#expected-days')
	}
	// Inquiry is prefered
	appealType(appealType) {
		taskList.clickAppealDecisionSectionLink();
		if (appealType === 'written') {
			this.elements.writtenRepresentation().check();
			basePage.clickSaveAndContiuneBtn();
		} else if (appealType === 'hearing') {
			this.elements.hearing().check();
			basePage.clickSaveAndContiuneBtn();
			basePage.enterTextArea('test');
			basePage.clickSaveAndContiuneBtn();
			basePage.fileUpload('cypress/fixtures/draft-statement-of-common-ground.pdf');
			basePage.clickSaveAndContiuneBtn();
		} else if (appealType === 'inquiry') {
			this.elements.inquiry().check();
			basePage.clickSaveAndContiuneBtn();
			basePage.enterTextArea('test');
			basePage.clickSaveAndContiuneBtn();
			this.elements.daysInput().clear().type('10');
			basePage.clickSaveAndContiuneBtn();
			basePage.fileUpload('cypress/fixtures/draft-statement-of-common-ground.pdf');
			basePage.clickSaveAndContiuneBtn();
		}
	}
}
