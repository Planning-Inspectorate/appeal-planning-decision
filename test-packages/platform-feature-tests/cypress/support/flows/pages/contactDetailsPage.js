import { ContactDetails } from "../../../page-objects/prepare-appeal/contact-details";
module.exports = () => {
    const contactDetails = new ContactDetails();
	
    contactDetails.addContactDetailsField('#contactFirstName','Contact firstname');
    contactDetails.addContactDetailsField('#contactLastName','Contact lastname');
    contactDetails.addContactDetailsField('#contactCompanyName','Test Company');
     
    cy.advanceToNextPage();
    //What is your phone number?
    contactDetails.addContactDetailsField('#appellantPhoneNumber','07434247100');
    cy.advanceToNextPage();
    // contactDetails.addContactDetailsField('#address-line-1','siteAddress_addressLine1');
    // contactDetails.addContactDetailsField('#address-line-2','siteAddress_addressLine2');
    // contactDetails.addContactDetailsField('#address-town','Test Town');
    // contactDetails.addContactDetailsField('#address-county','Test County1');
    // contactDetails.addContactDetailsField('#address-postcode','SW7 9PB'); 
    // cy.advanceToNextPage();
    
};