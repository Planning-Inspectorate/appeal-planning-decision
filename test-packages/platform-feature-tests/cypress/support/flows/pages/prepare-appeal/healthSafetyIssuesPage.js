import { BasePage } from "../../../../page-objects/base-page";
export class HealthSafetyIssuesPage {

    _selectors = {
        appellantSiteSafetyAppellantSiteSafetyDetails: '#appellantSiteSafety_appellantSiteSafetyDetails'
    }

    addHealthSafetyIssuesData(context) {
        const basePage = new BasePage();

        if (context?.applicationForm?.isAppellantSiteSafety) {
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            basePage.addTextField(this._selectors?.appellantSiteSafetyAppellantSiteSafetyDetails, 'appellantSiteSafety_appellantSiteSafetyDetails1234567890!"£$%^&*(10)');
            cy.advanceToNextPage();
        }
        else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();
        }
    };
}