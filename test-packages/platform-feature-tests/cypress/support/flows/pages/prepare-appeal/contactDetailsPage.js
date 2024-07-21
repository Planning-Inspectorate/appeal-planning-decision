import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();   

    basePage.addTextField('#contactFirstName', 'Contact firstname');
    basePage.addTextField('#contactLastName', 'Contact lastname');
    basePage.addTextField('#contactCompanyName', 'Test Company');
    cy.advanceToNextPage();  
	   
    //What is your phone number?
    basePage.addTextField('#contactPhoneNumber','07654321000');
    cy.advanceToNextPage();       

};