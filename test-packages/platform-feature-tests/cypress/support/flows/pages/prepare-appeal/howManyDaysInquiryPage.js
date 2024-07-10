import { HowManyDaysInquiry } from "../../../../page-objects/prepare-appeal/how-many-days-inquiry";
module.exports = () => {
    const enterHowManyDaysInquiry = new HowManyDaysInquiry();
	   
    //How many days would you expect the inquiry to last?
    enterHowManyDaysInquiry.addHowManyDaysInquiryField('#appellantPreferInquiryDuration','30');
    cy.advanceToNextPage();       
};