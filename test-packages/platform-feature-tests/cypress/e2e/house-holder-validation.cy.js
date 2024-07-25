import { submitHouseHolderAppealTestCases } from "../utils/houseHolderAppeal/submitHouseHolderAppealUtil";
const { submitAppealFlow } = require('../support/flows/appeal');

describe('House Holder Validations', () => {

    beforeEach(() => {
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        cy.get('#local-planning-department')
            .type('System Test Borough Council')
            .get('#local-planning-department__option--0')
            .click();
        cy.advanceToNextPage();
    })

    // House Holding
    //typeOfPlanningApplication?.forEach((planning) => {
    it(``, () => {
        submitAppealFlow({
            statusOfOriginalApplication,
            typeOfDecisionRequested,
            statusOfPlanningObligation,
            planning: typeOfPlanningApplication,
            context
        });


    });
});
