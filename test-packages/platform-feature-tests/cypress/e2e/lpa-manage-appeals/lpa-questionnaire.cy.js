//import { BasePage } from "../page-objects/base-page";

describe('LPA Manage Appeals Questionnaire', () => {    
 //   const basePage = new BasePage();    

    beforeEach(() => {
        // cy.fixture('prepareAppealData').then(data => {
        //     prepareAppealData = data;
        // })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
        cy.getByData('email-address').type('admin1@planninginspectorate.gov.uk');
        cy.advanceToNextPage();
        cy.get('#email-code').type('12345');
        cy.advanceToNextPage();


    })
   
    it(`LPA Manage Appeals Questionnaire`, () => {
       cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);      
    });  
    
    it(`Add and Remove user link validation`, () => {       
      //  cy.get('.govuk-link').contains('Add and remove users');
        cy.containsMessage('.govuk-link','Add and remove users');
     }); 
});