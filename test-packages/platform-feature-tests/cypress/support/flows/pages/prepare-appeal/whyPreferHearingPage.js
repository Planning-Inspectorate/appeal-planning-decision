import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
   	   
    //Why would you prefer a hearing?
    basePage.addTextField('#appellantPreferHearingDetails','To Argue in the court12345!£%^&*');
    cy.advanceToNextPage();       
};