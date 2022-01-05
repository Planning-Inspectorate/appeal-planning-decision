import { When, Then} from "cypress-cucumber-preprocessor/steps"
import {
  confirmNavigationPageNotFoundPage
} from '../../../../support/householder-planning/appeals-service/errors/confirmNavigationPageNotFoundPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';



When('an unknown url is requested',() => {
  goToAppealsPage('unknown-submission/unknown-page', {failOnStatusCode: false});
})


Then('the error page will be displayed', () => {
  confirmNavigationPageNotFoundPage();
})
