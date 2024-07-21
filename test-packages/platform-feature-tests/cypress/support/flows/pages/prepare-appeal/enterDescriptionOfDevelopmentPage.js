import { BasePage } from "../../../../page-objects/base-page";
module.exports = () => {
    const basePage = new BasePage();   
	   
    //Enter the description of development that you submitted in your application
    basePage.addTextField('#developmentDescriptionOriginal','developmentDescriptionOriginal-hint123456789!£$%&*j');
    cy.advanceToNextPage();       
};