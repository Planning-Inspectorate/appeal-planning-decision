import { PhoneNumber } from "../../../../page-objects/prepare-appeal/phone-number";
module.exports = () => {
    const phoneNumber = new PhoneNumber();
	   
    //What is your phone number?
    phoneNumber.addPhoneNumberField('#appellantPhoneNumber','07654321000');
    cy.advanceToNextPage();       
};