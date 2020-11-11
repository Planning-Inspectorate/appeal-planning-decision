import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import PO_EligibilityDecisionDate from '../PageObjects/PO_EligibilityDecisionDate'
import PO_EligibilityNoDecision from "../PageObjects/PO_EligibilityNoDecision"
const eligPage = new PO_EligibilityDecisionDate()
const eligNoDecisionPageObj = new PO_EligibilityNoDecision()

Given('I navigate to the Eligibility checker page', () => {

    eligPage.navigatetoEligDatePageURL()

})

And('I am on the descision date page', () => {

    eligPage.validatePageTitle()

})
