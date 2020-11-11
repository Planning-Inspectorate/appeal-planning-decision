import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import PO_EligibilityDecisionDate from '../PageObjects/PO_EligibilityDecisionDate'
import PO_EligibilityNoDecision from '../PageObjects/PO_EligibilityNoDecision'

const eligPage = new PO_EligibilityDecisionDate()
const eligNoDecPage = new PO_EligibilityNoDecision()

Given('I navigate to not received a decision page', () => {
    eligNoDecPage.navigateToNoDecisionPage()
})

Then('I can see the logo gov uk text', () => {
    {
    eligPage.validateHeaderLogo()

    }
 })

And('I can see the header link appeal a householder planning decision', () => {
   {
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

Then('I can see the LogIn or Register fields', () => {
    eligNoDecPage.appealsCaseworkPortalPageLogiIn()
})

And('I am on the descision date page', () => {
    eligPage.validateHeaderLogo()
    eligPage.validatePageTitle()
    eligPage.validateText()
    eligPage.notreceivedDecisionLink()
})
