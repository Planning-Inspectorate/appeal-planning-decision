import { Given, Then} from "cypress-cucumber-preprocessor/steps"
import {
  confirmNavigationPageNotFoundPage
} from '../../../../support/householder-planning/appeals-service/errors/confirmNavigationPageNotFoundPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';




Given('an unknown url is requested',() => {
  goToAppealsPage('/before-you-start/claiming-costs-householder-123', {failOnStatusCode: false});
})


Then('the error page will be displayed', () => {
  confirmNavigationPageNotFoundPage();
})
