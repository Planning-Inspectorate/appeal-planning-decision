
import { When, Then} from "cypress-cucumber-preprocessor/steps"
import { confirmNavigationPageNotFoundPage } from '../../../support/householder-planning/appeals-service/errors/confirmNavigationPageNotFoundPage';



When('an unknown url is requested',() => {
  cy.visit('/unknown-submission/unknown-page', {failOnStatusCode: false});
})


Then('the error page will be displayed', () => {
  confirmNavigationPageNotFoundPage();
})
