
import { BasePage } from "../../../../page-objects/base-page";
import { InspectorNeedAccess } from "../../../../page-objects/prepare-appeal/inspector-need-access";
module.exports = () => {
    const inspectorNeedAccess = new InspectorNeedAccess();
    //Will an inspector need to access your land or property?  Ans:Yes

    inspectorNeedAccess.clickRadioBtn('[data-cy="answer-yes"]');

    inspectorNeedAccess.addInspectorNeedAccessField('#appellantSiteAccess','the appeal site is at the rear of a terraced property123456789aAbcdEF!"£$%QA'); 
    
    cy.advanceToNextPage();    
    
};