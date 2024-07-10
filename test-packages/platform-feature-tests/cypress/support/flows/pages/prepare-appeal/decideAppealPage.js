import { DecideAppeal } from "../../../../page-objects/prepare-appeal/decide-appeal";
module.exports = () => {
    const decideAppeal = new DecideAppeal();
    decideAppeal.clickDecideAppeal('#appellantProcedurePreference-2');        
    cy.advanceToNextPage();        
    
};