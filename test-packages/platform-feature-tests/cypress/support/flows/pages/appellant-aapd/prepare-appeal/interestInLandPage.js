// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../../page-objects/prepare-appeal/prepare-appeal-selector";

export class InterestInLandPage {

    /**
     * Answers "Is the appeal site address your contact address?" and, if yes,
     * "What is [party]'s interest in the land?" plus the follow-up
     * "Do you have permission to use the land?" question shown only for "other".
     */
    addInterestInLandData(context, prepareAppealData) {
        const basePage = new BasePage();
        const prepareAppealSelector = new PrepareAppealSelector();
        const prepareAppealUrl = prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal;

        if (!context?.applicationForm?.isSiteAddressContactAddress) {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
            return;
        }

        cy.getByData(basePage?._selectors.answerYes).click();
        cy.advanceToNextPage();

        cy.validateURL(`${prepareAppealUrl}/land-interest`);
        if (context?.applicationForm?.interestInLand === 'other') {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerInterestInLandOther).click();
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.interestInAppealLandDetails).type(
                prepareAppealData?.interestInLandDetails ?? 'Other interest in land details'
            );
            cy.advanceToNextPage();

            // Do you have written or verbal permission to use the land? (only shown when interest is 'other')
            cy.validateURL(`${prepareAppealUrl}/land-permission`);
            if (context?.applicationForm?.hasPermissionToUseLand) {
                cy.getByData(basePage?._selectors.answerYes).click();
            } else {
                cy.getByData(basePage?._selectors.answerNo).click();
            }
            cy.advanceToNextPage();
        } else if (context?.applicationForm?.interestInLand === 'tenant') {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerInterestInLandTenant).click();
            cy.advanceToNextPage();
        } else if (context?.applicationForm?.interestInLand === 'mortgageLender') {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerInterestInLandMortgageLender).click();
            cy.advanceToNextPage();
        } else {
            // Default: Owner
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerInterestInLandOwner).click();
            cy.advanceToNextPage();
        }
    };
}
