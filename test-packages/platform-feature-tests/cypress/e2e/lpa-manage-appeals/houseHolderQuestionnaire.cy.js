import { houseHolderQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/houseHolderQuestionnaireData";
const { lpaQuestionnaire } = require('../../support/flows/sections/lpaManageAppeals/lpaQuestionnaire');

describe('House Holder Questionnaire Test Cases', () => {
	let prepareAppealData;
	beforeEach(() => {
        // cy.fixture('prepareAppealData').then(data => {
        //     prepareAppealData = data;
        // })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
        const emailurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`;
        const appelurl = `${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`;
        cy.url().then((url)=>{
                if(url.includes('/manage-appeals/your-email-address')){
                        cy.getByData('email-address').type('admin1@planninginspectorate.gov.uk');
                        cy.advanceToNextPage();
                        cy.get('#email-code').type('12345');
                        cy.advanceToNextPage();
                }
        });
        
	});
	houseHolderQuestionnaireTestCases.forEach((context) => {
		
		it(`
            Should validate House holder questionnaire screen, Appeal Type: HAS 
            - User selects correct type of appeal ${context.isCorrectTypeOfAppeal}
            - User selects affect listed buildings ${context.affectListedBuildings}
            - User selects affected listed buidings ${context.affectedListedBuildings}
            - User selects conservation area ${context.conservationArea}
            - User selects green belt area ${context.isGreenBelt}          	
		 `, () => {
			lpaQuestionnaire(context);
		});
	});
});
