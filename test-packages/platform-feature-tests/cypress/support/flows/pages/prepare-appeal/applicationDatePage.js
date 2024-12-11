// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../support/flows/sections/dateService";
export class ApplicationDatePage {

    

    _selectors = {
        onApplicationDateDay: '#onApplicationDate_day',
        onApplicationDateMonth: '#onApplicationDate_month',
        onApplicationDateYear: '#onApplicationDate_year',
    }

    addApplicationDateData() {
        const basePage = new BasePage();
        const date = new DateService();
        basePage.addTextField(this._selectors.onApplicationDateDay, date.today());
        basePage.addTextField(this._selectors.onApplicationDateMonth, date.currentMonth());
        basePage.addTextField(this._selectors.onApplicationDateYear, date.currentYear());
        cy.advanceToNextPage();
    };

}
