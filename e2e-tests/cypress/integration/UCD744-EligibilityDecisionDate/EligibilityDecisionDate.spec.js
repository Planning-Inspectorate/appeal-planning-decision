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

And('I can see the header link appeal a householder planning decision', () => {
    eligPage.pageHeaderlink()
})

Then('a validation error is displayed', () => {
    eligPage.validateError()
})

// And('I can see the text and date fields', () => {
//     //cy.get(':nth-child(1) > .gem-c-document-list__item-title').contains('Tax your vehicle')
//     /*cy.title().should('eq', "What's the decision date on the letter from the local planning department?​")*/
//     cy.get('.govuk-date-input').find('[id="decision-date-day"]').type('10')
//     cy.get('.govuk-date-input').find('[id="decision-date-month"]').type('10)')
//     cy.get('.govuk-date-input').find('[id="decision-date-year"]').type('2020')
//     eligPage.validatePageTitle()
//     eligPage.dateFields()
// })

And('I can see the footer', () => {
    eligPage.valdiatePageFooter()
})



// When(/^I enter Day as (.+)$/, Day => {
//     cy.get('#decision-date-day').type('Day')
// })

Then('I can see that I am able to enter numeric text in format DDMMYYYY', function () {
    eligPage.validateText()
})


And('I enter Day as {int} and Month as {int} and Year as {int}', (day, month, year) => {
       cy.debug()
    //     datatable.hashes().forEach(element => {
    //     eligPage.dateFields(element.Day, element.Month, element.Year)
    //
    // });
    eligPage.pageHeaderlink()
})


// And('I enter Day as {int} and Month as {int} and Year as {int}', (Day, Month, Year) => {
//     cy.get('.govuk-date-input').find('[id="decision-date-day"]').type('Day')
//         cy.get('.govuk-date-input').find('[id="decision-date-month"]').type('Month)')
//          cy.get('.govuk-date-input').find('[id="decision-date-year"]').type('Year')

//    })



/*When('I enter Day as {}', (datatable) => {
    datatable.hashes().array.forEach(element => {
        eligPage.dateFields(element.Day, element.Month, element.Year)
    });
    cy.get(id).type('Day')

})*/



/*When('I enter Day as "([1-31])"', Day => {
    cy.get('#decision-date-day').type('Day')
})*/

/*When('I enter Day as {int}', Day => {
    cy.get(id).type('Day')
})*/

// When(/^I enter Day as (.+)$/, Day => {
//     cy.get('#decision-date-day').type('Day')
// })
// And(/^I enter Month as (.+)$/, Month => {
//     cy.get('#decision-date-month').type('Month')

// })
// And(/^I enter Year as (.+)$/, Year => {
//     cy.get('#decision-date-year').type('Year')

// })


When('I click on Continue button', () => {
    eligPage.continueBtn()
})


Then('I can see the link is displayed', () => {
    eligPage.notreceivedDecisionLink()
})

When('I select the link', () => {
    eligPage.notreceivedDecisionLinkSelect()
})

Then('I am on the not received a decision date page', () => {
    eligNoDecisionPageObj.serviceText()
})
