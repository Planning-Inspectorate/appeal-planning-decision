import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
   	   
    //How many days would you expect the inquiry to last?
    basePage.addTextField('#appellantPreferInquiryWitnesses','30');
    cy.advanceToNextPage();       
};