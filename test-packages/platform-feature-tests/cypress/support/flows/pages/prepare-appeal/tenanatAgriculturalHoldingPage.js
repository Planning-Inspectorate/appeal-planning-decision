
import { BasePage } from "../../../../page-objects/base-page";
import { OtherTenantsPage } from "./otherTenantsPage";
export class TenanatAgriculturalHoldingPage {

    addTenanatAgriculturalHoldingData(isTenantAgricultureHolding, context) {
        const basePage = new BasePage();
        const otherTenantsPage = new OtherTenantsPage();

        if (isTenantAgricultureHolding) {
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            otherTenantsPage.addOtherTenantsData(context?.applicationForm?.anyOtherTenants, context);
        } else {
            basePage.clickRadioBtn('[data-cy="answer-no"]');
            cy.advanceToNextPage();

            basePage.clickCheckBox('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        }
    };
}