
import { When, Then} from "cypress-cucumber-preprocessor/steps"



When('an unknown url is requested',() => {
  cy.visit('/unknown-submission/unknown-page', {failOnStatusCode: false});
})


Then('the error page will be displayed', () => {
  cy.confirmNavigationPageNotFoundPage();
})
