import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    
    const basePage = new BasePage();
    let currentDate = new Date();
    basePage.addTextField('#onApplicationDate_day',currentDate.getDate());
    basePage.addTextField('#onApplicationDate_month',currentDate.getMonth() - 1);
    basePage.addTextField('#onApplicationDate_year',currentDate.getFullYear());     
    cy.advanceToNextPage();      
};