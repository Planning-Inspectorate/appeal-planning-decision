import { WhyPreferInquiry } from "../../../../page-objects/prepare-appeal/why-prefer-inquiry";
module.exports = () => {
    const enterWhyPreferInquiry = new WhyPreferInquiry();
	   
    //Why would you prefer a inquiry?
    enterWhyPreferInquiry.addWhyPreferInquiryField('#appellantPreferInquiryDetails','Previous decision is not correct 12345!£%^&*');
    cy.advanceToNextPage();       
};