
import { BasePage } from "../../../../page-objects/base-page";
const otherTenants = require('./otherTenantsPage');
export class TenanatAgriculturalHoldingPage {

    addTenanatAgriculturalHoldingData(isTenantAgricultureHolding, context) {
        const basePage = new BasePage();

        if (isTenantAgricultureHolding) {
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            otherTenants(context?.applicationForm?.anyOtherTenants, context);
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();

            basePage.clickCheckBox('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        }
    };
}