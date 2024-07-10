import { HowManyWitnesses } from "../../../../page-objects/prepare-appeal/how-many-witnesses";
module.exports = () => {
    const enterHowManyWitnesses = new HowManyWitnesses();
	   
    //How many days would you expect the inquiry to last?
    enterHowManyWitnesses.addHowManyWitnessesField('#appellantPreferInquiryWitnesses','30');
    cy.advanceToNextPage();       
};