import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
    	   
    //Why would you prefer a inquiry?
    basePage.addTextField('#appellantPreferInquiryDetails','Previous decision is not correct 12345!£%^&*');
    cy.advanceToNextPage();       
};