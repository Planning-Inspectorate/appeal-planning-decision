import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();
	   
    basePage.addTextField('#appellantFirstName','firstname');
    basePage.addTextField('#appellantLastName','lastname');
    basePage.addTextField('#appellantCompanyName','companyname')

    cy.advanceToNextPage();

    
};
