import { houseHolderQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/houseHolderQuestionnaireData";
const { lpaQuestionnaire } = require('../../support/flows/sections/lpaManageAppeals/lpaQuestionnaire');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('House Holder Questionnaire Test Cases', () => {
        const yourAppealsSelector = new YourAppealsSelector();
        let lpaQuestionnaireData;
        beforeEach(() => {
                cy.fixture('lpaQuestionnaireData').then(data => {
                        lpaQuestionnaireData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
                const emailurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`;
                const appealurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`;
                cy.url().then((url) => {
                        if (url.includes('/manage-appeals/your-email-address')) {
                                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear().type(lpaQuestionnaireData?.emailAddress);
                                cy.wait(1000);
                                cy.advanceToNextPage();
                                cy.wait(1000);
                                cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaQuestionnaireData?.emailCode);
                                cy.advanceToNextPage();
                        }
                });

        });
        houseHolderQuestionnaireTestCases.forEach((context) => {

                it(`
            Should validate House holder questionnaire screen, Appeal Type: HAS 
            - User selects correct type of appeal ${context.constraintsAndDesignations?.isCorrectTypeOfAppeal}
            - User selects affect listed buildings ${context.constraintsAndDesignations?.affectListedBuildings}
            - User selects affected listed buidings ${context.constraintsAndDesignations?.affectedListedBuildings}
            - User selects conservation area ${context.constraintsAndDesignations?.conservationArea}
            - User selects green belt area ${context.constraintsAndDesignations?.isGreenBelt}          	
		 `, () => {
                        lpaQuestionnaire(context, lpaQuestionnaireData);
                });
        });
});
