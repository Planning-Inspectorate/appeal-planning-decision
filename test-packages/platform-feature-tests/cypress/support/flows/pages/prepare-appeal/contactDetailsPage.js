import { ContactDetails } from "../../../../page-objects/prepare-appeal/contact-details";
module.exports = () => {
    const contactDetails = new ContactDetails();
	
    contactDetails.addContactDetailsField('#contactFirstName','Contact firstname');
    contactDetails.addContactDetailsField('#contactLastName','Contact lastname');
    contactDetails.addContactDetailsField('#contactCompanyName','Test Company');     
    cy.advanceToNextPage();
      
};