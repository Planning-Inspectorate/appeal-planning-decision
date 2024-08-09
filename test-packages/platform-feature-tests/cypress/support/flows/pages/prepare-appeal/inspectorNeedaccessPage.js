
import { BasePage } from "../../../../page-objects/base-page";
export class InspectorNeedAccessPage {

    _selectors = {
        appellantSiteAccessAppellantSiteAccessDetails: '#appellantSiteAccess_appellantSiteAccessDetails'
    }

    addInspectorNeedAccessData(isInspectorNeedAccess) {
        const basePage = new BasePage();
        //Will an inspector need to access your land or property?  Ans:Yes
        if (isInspectorNeedAccess) {
            cy.getByData(basePage?._selectors.answerYes).click();
            basePage.addTextField(this._selectors?.appellantSiteAccessAppellantSiteAccessDetails, 'the appeal site is at the rear of a terraced property123456789aAbcdEF!"£$%QA');
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}