// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../../page-objects/prepare-appeal/prepare-appeal-selector";

export class WhoIsAppealingPage {

    /**
     * Answers "Who is appealing against the enforcement notice?" and the follow-up
     * questions specific to the chosen appellant type (individual/additional
     * appellants/organisation).
     * @returns {boolean} whether the contact-details/complete-appeal pages should be shown next
     */
    addWhoIsAppealingData(context, prepareAppealData) {
        const basePage = new BasePage();
        const prepareAppealSelector = new PrepareAppealSelector();
        const appellantType = context?.applicationForm?.appellantType;
        const prepareAppealUrl = prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal;

        if (appellantType === 'organisation') {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerOrganisation).click();
        } else if (appellantType === 'additional-appellants') {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerAdditionalAppellants).click();
        } else {
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerIndividual).click();
        }
        cy.advanceToNextPage();

        let showContactDetailsAndCompleteOnBehalf = true;

        if (appellantType === 'individual' || !appellantType) {
            cy.validateURL(`${prepareAppealUrl}/individual-name`);
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.appellantFirstName).type(prepareAppealData?.appellant?.firstName ?? 'Test first name');
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.appellantLastName).type(prepareAppealData?.appellant?.lastName ?? 'Test Last name');
            cy.advanceToNextPage();

            cy.validateURL(`${prepareAppealUrl}/are-you-individual`);
            if (context?.applicationForm?.isAppellant) {
                // Yes - I am the appellant
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                cy.validateURL(`${prepareAppealUrl}/phone-number`);
                cy.get(prepareAppealSelector?._enforcementAppealSelectors?.contactPhoneNumber).type(prepareAppealData?.appellant?.phoneNumber ?? '01234567890');
                cy.advanceToNextPage();

                // contact-details and complete-appeal pages are not shown when the individual is answering for themselves
                showContactDetailsAndCompleteOnBehalf = false;
            } else {
                // No - I am appealing on behalf of the appellant
                cy.getByData(basePage?._selectors.answerNo).click();
                cy.advanceToNextPage();
            }
        } else if (appellantType === 'additional-appellants') {
            cy.validateURL(`${prepareAppealUrl}/add-another-individual`);
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.namedIndividualFirstName).type(prepareAppealData?.appellant?.firstName ?? 'Test first name');
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.namedIndividualLastName).type(prepareAppealData?.appellant?.lastName ?? 'Test Last name');
            cy.advanceToNextPage();

            // Do you need to add another individual?
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();

            // Select your name - none of the named individuals is filling out this appeal
            cy.validateURL(`${prepareAppealUrl}/select-name`);
            cy.getByData(prepareAppealSelector?._enforcementAppealSelectors?.answerSelectYourNameNone).click();
            cy.advanceToNextPage();
        } else if (appellantType === 'organisation') {
            cy.validateURL(`${prepareAppealUrl}/organisation-name`);
            cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementOrganisationName).type(prepareAppealData?.organisation?.name ?? 'Test Organisation Ltd');
            cy.advanceToNextPage();
        }

        return showContactDetailsAndCompleteOnBehalf;
    };
}
