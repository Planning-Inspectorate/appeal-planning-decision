import { ContactDetails } from "../../../../page-objects/prepare-appeal/contact-details";
import { PhoneNumber } from "../../../../page-objects/prepare-appeal/phone-number";
module.exports = (context) => {
    const contactDetails = new ContactDetails();
    const phoneNumber = new PhoneNumber();

    contactDetails.addContactDetailsField('#contactFirstName', 'Contact firstname');
    contactDetails.addContactDetailsField('#contactLastName', 'Contact lastname');
    contactDetails.addContactDetailsField('#contactCompanyName', 'Test Company');
    cy.advanceToNextPage();  
	   
    //What is your phone number?
    phoneNumber.addPhoneNumberField('#contactPhoneNumber','07654321000');
    cy.advanceToNextPage();       

};