import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import PO_EligibilityDecisionDate from '../PageObjects/PO_EligibilityDecisionDate'
import PO_EligibilityNoDecision from '../PageObjects/PO_EligibilityNoDecision'

const eligPage = new PO_EligibilityDecisionDate()
const eligNoDecPage = new PO_EligibilityNoDecision()

Given('I navigate to not received a decision page', () => {
    //cy.visit('https://has-appeal-alpha.herokuapp.com/v7/eligibility/decision-date')
    eligNoDecPage.navigateToNoDecisionPage()
    //cy.visit("www.google.com")
})

Then('I can see the logo gov uk text', () => {
    {
    eligPage.validateHeaderLogo()

    }
 })

And('I can see the header link appeal a householder planning decision', () => {
   {
    //eligPage.validateHeaderLogo()
    eligPage.pageHeaderlink()
   }
})

And('I can see the text This service is only for householder planning applications', () => {
    eligNoDecPage.serviceText()
})

And('I can see the footer', () => {
    eligPage.valdiatePageFooter()
})

And('I can see the link Appeal a Planning Decision service', () => {
    eligNoDecPage.appealPlanningDecLink()
})

Given('I am on the Appeals Casework Portal page', () => {
    eligNoDecPage.appealsCaseworkPortalPage()
})

/*Then('the link url should be equal to Appeals Casework Portal page', () => {
    eligNoDecPage.appealsCaseWorkPageURL()
})*/

Then('I can see the LogIn or Register fields', () => {
    eligNoDecPage.appealsCaseworkPortalPageLogiIn()
})

And('I am on the descision date page', () => {
    /*cy.get('.govuk-caption-l').should('eq',"Before you start")
   cy.get('.govuk-fieldset__heading').should('eq',"What's the decision date on the letter from the local planning department?​")
   cy.get('.govuk-hint').should('eq',"For example, 20 04 2020")
   cy.get('a[href="I have not received a decision from the local planning department​"]')*/
    eligPage.validateHeaderLogo()
    eligPage.validatePageTitle()
    eligPage.validateText()
    eligPage.notreceivedDecisionLink()
})
