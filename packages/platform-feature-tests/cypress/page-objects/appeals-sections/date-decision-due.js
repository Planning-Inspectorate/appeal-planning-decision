import { BasePage } from "../base-page";

export class DateOfDecisionDue extends BasePage{

    elements = {
        dayDate: () => cy.get('#decision-date-day'),
        monthDate: () => cy.get('#decision-date-month'),
        yearDate: () => cy.get('#decision-date-year')
    }

    enterDayDate(day){
        this.elements.dayDate().type(day)
    }

    enterMontDate(month){
        this.elements.monthDate().type(month)
    }

    enterYearDate(year){
        this.elements.yearDate().type(year)
    }
}