export class DateOfDecisionDue {
	elements = {
		dayDate: () => cy.get('#decision-date-day'),
		monthDate: () => cy.get('#decision-date-month'),
		yearDate: () => cy.get('#decision-date-year')
	};

	enterDayDate(day) {
		this.elements.dayDate().clear().type(day);
	}

	enterMontDate(month) {
		this.elements.monthDate().clear().type(month);
	}

	enterYearDate(year) {
		this.elements.yearDate().clear().type(year);
	}
}
