import { ApplicationDate } from "../../../../page-objects/prepare-appeal/application-date";
module.exports = () => {
    const applicationDate = new ApplicationDate();
    let currentDate = new Date();
    applicationDate.addApplicationDateField('#onApplicationDate_day',currentDate.getDate());
    applicationDate.addApplicationDateField('#onApplicationDate_month',currentDate.getMonth() - 1);
    applicationDate.addApplicationDateField('#onApplicationDate_year',currentDate.getFullYear());     
    cy.advanceToNextPage();      
};