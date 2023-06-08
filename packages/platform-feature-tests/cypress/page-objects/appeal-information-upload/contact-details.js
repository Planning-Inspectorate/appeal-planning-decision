import { BasePage } from "../base-page"
import { TaskList } from "./task-list"

const basePage = new BasePage
const taskList = new TaskList

export class ContactDetails {
    elements = {
        fullNameInputField: () => cy.get('#appellant-name'),
        companyNameInputField: () => cy.get('#appellant-company-name'),
        behalfOfApplicantInput: () => cy.get('#behalf-appellant-name'),
        companyNameAgent: () => cy.get('#company-name')
    }

    contactType(contactType){
         taskList.clickContactDetailsLink();
            if (contactType === 'Myself') {
                cy.url().should('include', 'original-applicant')
                basePage.selectRadioBtn('yes');
                cy.url().should('include', 'contact-details')
                basePage.clickSaveAndContiuneBtn();
                this.elements.fullNameInputField().clear().type('Tom Test');
                this.elements.companyNameInputField().clear().type('Test Company');
                basePage.clickSaveAndContiuneBtn();
            }
            else if (contactType === 'Behalf') {
                cy.url().should('include', 'original-applicant')
                basePage.selectRadioBtn('no');
                basePage.clickSaveAndContiuneBtn();
                cy.url().should('include', 'applicant-name')
                this.elements.behalfOfApplicantInput().clear().type('Tim Test');
                this.elements.companyNameAgent().clear().type('Test Company');
                basePage.clickSaveAndContiuneBtn();
                cy.url().should('include', 'contact-details')
                this.elements.fullNameInputField().clear().type('Tom Test');
                this.elements.companyNameInputField().clear().type('Test Company');
                basePage.clickSaveAndContiuneBtn();
            }
    }
}