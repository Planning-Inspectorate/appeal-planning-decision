import moment from "moment";

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import PO_EligibilityDecisionDate from './PageObjects/PO_EligibilityDecisionDate'
import PO_EligibilityNoDecision from "./PageObjects/PO_EligibilityNoDecision"
import {eligibleDate} from "../eligibility-decision-date/eligibility-decision-date";
const eligPage = new PO_EligibilityDecisionDate()
const eligNoDecPage = new PO_EligibilityNoDecision()


Given('I navigate to {string}', (url) => {
    cy.visit(url);
})

Then('I am on {string}', (url) => {
  cy.url().should('include', url);
})

When('I select the Back link', () => {
  cy.get('[data-cy="back"]').click();
})

When('I enter today minus {int} days', (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  const day = then.format('DD');
  const month = then.format('MM');
  const year = then.format('yyyy');

  eligPage.dateFields(day, month, year);
});

When('I select the I have not received a decision from the local planning dept link', () => {
  cy.get('[data-cy="no-decision-received"]').click();

});

Then('I can see the link Appeal a Planning Decision service and it links to {string}', (url) => {
  cy.get('[data-cy="appeal-decision-service"]').invoke('attr', 'href').then((href) => {
    expect(href).to.contain(url);
  });
});


Given('I navigate to the Eligibility checker page', () => {
    eligPage.navigatetoEligDatePageURL()
})

And("I can verify the text what is the decision date on the letter", () => {
    eligPage.validateText()
})


Then('I can see the logo gov uk text', () => {
    eligPage.validateHeaderLogo()
})

And('I can see the header link appeal a householder planning decision', () => {
    eligPage.pageHeaderlink()
})

And('I can see the text This service is only for householder planning applications', () => {
    eligPage.pageHeaderlink()
})

Then('a validation {string} is displayed and I am on the same page', () => {
    eligPage.validateError()
})

And('I can see the footer', () => {
    eligPage.valdiatePageFooter()
})

Then('I can see that I am able to enter numeric text in format DDMMYYYY', function () {
    eligPage.validateError()
})


When('I enter Day as {string} and Month as {string} and Year as {string}', (day, month, year) => {
      eligPage.dateFields(day, month, year)
})


Then('a validation {string} is displayed and I am still on the Eligibility checker page', (errorMessage) => {
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain(errorMessage);
  });
})

When('I click on Continue button', () => {
    eligPage.continueBtn()
})

And('I click on Continue button', () => {
    eligPage.continueBtn()
})

Then('I can see the link is displayed', () => {
    eligPage.notreceivedDecisionLink()
})

When('I select the link', () => {
    eligPage.notreceivedDecisionLinkSelect()
})

Then('I am on the not received a decision date page', () => {
    eligPage.serviceText()
})

Then('I am the local planning department page', () => {
   eligPage.localPlanDeptText()
})

Then('I am the deadline for appeal has passed page', () => {
    eligPage.deadlinePassedPageText()
 })


Given('I navigate to not received a decision page', () => {
     eligNoDecPage.navigateToNoDecisionPage()
  })

And('I can see the text This service is only for householder planning applications', () => {
    eligNoDecPage.serviceText()
})

And('I can see the link Appeal a Planning Decision service', () => {
    eligNoDecPage.appealPlanningDecLink()
})

Given('I am on the Appeals Casework Portal page', () => {
    eligNoDecPage.appealsCaseworkPortalPage()
})

Then('I can see the LogIn or Register fields', () => {
    eligPage.appealsCaseworkPortalPageLogiIn()
})

And('I am on the decision date page', () => {
    eligPage.validateHeaderLogo()
    eligPage.validatePageTitle()
    eligPage.validateText()
    eligPage.notreceivedDecisionLink()
})
