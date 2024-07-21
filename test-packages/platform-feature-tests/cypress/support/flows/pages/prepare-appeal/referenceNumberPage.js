import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
    	   
    //What is application reference number?
    basePage.addTextField('#applicationReference','TEST-171947077123712345x6');
    cy.advanceToNextPage();       
};