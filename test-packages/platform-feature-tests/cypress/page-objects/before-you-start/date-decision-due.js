// @ts-nocheck
/// <reference types="cypress"/>
export class DateOfDecisionDue {
	elements = {
		dayDate: () => cy.get('#decision-date-day'),
		monthDate: () => cy.get('#decision-date-month'),
		yearDate: () => cy.get('#decision-date-year')
	}

	currentDate = new Date();
	
	enterDayDate() {
		this.elements.dayDate().clear().type(this.currentDate.getDate());
	}

	enterMontDate() {
		this.elements.monthDate().clear().type(this.currentDate.getMonth() - 1);
	}

	enterYearDate() {
		this.elements.yearDate().clear().type(this.currentDate.getFullYear());
	}
}