import { BasePage } from "../../../../page-objects/base-page";
export class ApplicationDatePage{
    
    _selectors={
        onApplicationDateDay: '#onApplicationDate_day',
        onApplicationDateMonth: '#onApplicationDate_month',
        onApplicationDateYear: '#onApplicationDate_year',
    }

    addApplicationDateData(){
        const basePage = new BasePage();
        let currentDate = new Date();
        basePage.addTextField(this._selectors.onApplicationDateDay,currentDate.getDate());
        basePage.addTextField(this._selectors.onApplicationDateMonth,currentDate.getMonth() - 1);
        basePage.addTextField(this._selectors.onApplicationDateYear,currentDate.getFullYear());     
        cy.advanceToNextPage();  
    };
   
}
