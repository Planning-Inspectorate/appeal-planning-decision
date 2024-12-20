// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from '../base-page';
import { TaskList } from './task-list';

const basePage = new BasePage();
const taskList = new TaskList();

export class ContactDetails {
	elements = {
		fullNameInputField: () => cy.get('#appellant-name'),
		companyNameInputField: () => cy.get('#appellant-company-name'),
		behalfOfApplicantInput: () => cy.get('#behalf-appellant-name'),
		companyNameAgent: () => cy.get('#company-name')
	}
	// Yourself is prefered
	contactType(contactType) {
		taskList.clickContactDetailsLink();
		if (contactType === 'Myself') {
			cy.url().should('include', 'original-applicant');
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'contact-details');
			this.elements.fullNameInputField().clear().type('Tom Test');
			this.elements.companyNameInputField().clear().type('Test Company');
			basePage.clickSaveAndContiuneBtn();
		} else {
			cy.url().should('include', 'original-applicant');
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'applicant-name');
			this.elements.behalfOfApplicantInput().clear().type('Tim Test');
			this.elements.companyNameAgent().clear().type('Test Company');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'contact-details');
			this.elements.fullNameInputField().clear().type('Tom Test');
			this.elements.companyNameInputField().clear().type('Test Company');
			basePage.clickSaveAndContiuneBtn();
		}
	}
}
