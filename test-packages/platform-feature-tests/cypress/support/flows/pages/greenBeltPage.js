import { GreenBelt } from "../../../page-objects/prepare-appeal/green-belt";
module.exports = () => {
    const greenbelt = new GreenBelt();

	// if(appellant === 'Myself' ) {

    // }
    // else{
        greenbelt.clickAppellantGreenBelt('#appellantGreenBelt-2');        
        cy.advanceToNextPage();        
  //  }
    
};