import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { stateCaseInvolvesListedBuilding } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/stateCaseInvolvesListedBuilding';
import { provideNoListedBuildingStatement } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/provideNoListedBuildingStatement';
import { stateCaseDoesNotInvolveAListedBuilding } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/stateCaseDoesNotInvolveAListedBuilding';
import { browseBackToTheListedBuildingPage } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/browseBackToTheListedBuildingPage';
import { confirmUserCanProceedWithNonListedBuilding } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/confirmUserCanProceedWithNonListedBuilding';
import { confirmListedBuildingsCannotProceed } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/confirmListedBuildingsCannotProceed';
import { confirmRedirectToExternalService } from '../../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmRedirectToExternalService';
import { confirmListedBuildingStatementIsRequired } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/confirmListedBuildingStatementIsRequired';
import { confirmProvidedAnswerIsDisplayed } from '../../../../support/householder-planning/appeals-service/eligibility-listed-building-status/confirmProvidedAnswerIsDisplayed';

When('the user does not provide a Listed Building statement', () => {
  provideNoListedBuildingStatement();
});

When('the user states that their case concerns a Listed Building', () => {
  stateCaseInvolvesListedBuilding();
});

When('the user states that their case does not concern a Listed Building', () => {
  stateCaseDoesNotInvolveAListedBuilding();
});

When('the user returns to the listed building page', () => {
  browseBackToTheListedBuildingPage();
});

Then('the user can proceed to the claiming Costs eligibility check', () => {
  confirmUserCanProceedWithNonListedBuilding();
});

Then(
  'the user is informed that cases concerning a Listed Building cannot be processed via this service',
  () => {
    confirmListedBuildingsCannotProceed();
  },
);

Then('the user is directed to the Appeal a Planning Decision service', () => {
  confirmRedirectToExternalService();
});

Then('the user is informed that a Listed Building statement is required', () => {
  confirmListedBuildingStatementIsRequired();
});

Then('the user sees their previous given answer is correctly displayed', () => {
  confirmProvidedAnswerIsDisplayed();
});
