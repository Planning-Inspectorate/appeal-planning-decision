import { WhyPreferHearing } from "../../../../page-objects/prepare-appeal/why-prefer-hearing";
module.exports = () => {
    const enterWhyPreferHearing = new WhyPreferHearing();
	   
    //Why would you prefer a hearing?
    enterWhyPreferHearing.addWhyPreferHearingField('#appellantPreferHearingDetails','To Argue in the court12345!£%^&*');
    cy.advanceToNextPage();       
};