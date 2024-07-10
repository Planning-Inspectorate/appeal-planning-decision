import { EnterDescriptionOfDevelopment } from "../../../../page-objects/prepare-appeal/enter-description-of-development";
module.exports = () => {
    const enterDescriptionOfDevelopment = new EnterDescriptionOfDevelopment();
	   
    //Enter the description of development that you submitted in your application
    enterDescriptionOfDevelopment.addEnterDescriptionOfDevelopmentField('#developmentDescriptionOriginal','developmentDescriptionOriginal-hint123456789!£$%&*j');
    cy.advanceToNextPage();       
};