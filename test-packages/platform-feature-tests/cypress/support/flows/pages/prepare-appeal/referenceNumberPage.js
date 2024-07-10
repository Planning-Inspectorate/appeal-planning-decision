import { ReferenceNumber } from "../../../../page-objects/prepare-appeal/reference-number";
module.exports = () => {
    const referenceNumber = new ReferenceNumber();
	   
    //What is application reference number?
    referenceNumber.addReferenceNumberField('#applicationReference','TEST-171947077123712345x6');
    cy.advanceToNextPage();       
};