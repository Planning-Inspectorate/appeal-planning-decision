import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { pageURLAppeal } from './pageURLAppeal';
import { provideLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/provideLocalPlanningDepartment';
import { clickSaveAndContinue } from '../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmTextOnPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmTextOnPage';
import { confirmNavigationLocalPlanningDepartmentPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationLocalPlanningDepartmentPage';
import { confirmNavigationEnforcementNoticePage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationEnforcementNoticePage';
import { provideEligibleLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/provideEligibleLocalPlanningDepartment';
import { provideIneligibleLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/provideIneligibleLocalPlanningDepartment';
import { confirmPlanningDepartmentSelectedWithoutJs } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmPlanningDepartmentSelectedWithoutJs';
import { confirmPlanningDepartmentSelected } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmPlanningDepartmentSelected';
import { confirmIneligibleLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmIneligibleLocalPlanningDepartment';
import { confirmEligibleLocalPlanningDepartmentWithoutJs } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmEligibleLocalPlanningDepartmentWithoutJs';
import { confirmEligibleLocalPlanningDepartment } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmEligibleLocalPlanningDepartment';
import { confirmProviedLocalPlanningDepartmentWasAccepted } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmProviedLocalPlanningDepartmentWasAccepted';
import { selectEligibleLocalPlanningDepartmentWithoutJs } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/selectEligibleLocalPlanningDepartmentWithoutJs';
import { confirmLocalPlanningDepartmentIsNotParticipating } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmLocalPlanningDepartmentIsNotParticipating';
import { confirmLocalPlanningDepartmentIsRequired } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/confirmLocalPlanningDepartmentIsRequired';
import { selectIneligibleLocalPlanningDepartmentWithoutJs } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/selectIneligibleLocalPlanningDepartmentWithoutJs';
import { selectLocalPlanningDepartmentWithoutJs } from '../../../support/householder-planning/appeals-service/eligibility-local-planning-department/selectLocalPlanningDepartmentWithoutJs';
import { goToAppealsPage } from '../../../support/householder-planning/appeals-service/go-to-page/goToAppealsPage';

Given('the list of Local Planning Department is presented', () => {
  //goToPlanningDepartmentPage();
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
});

Given('the user can select from a list of Local Planning Departments', () => {
  //goToPlanningDepartmentPageWithoutJs();
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPageWithoutJs);
});

When('the user does not provide a Local Planning Department', () => {
  provideLocalPlanningDepartment('');
  clickSaveAndContinue();
});

When('the user does not select a Local Planning Department', () => {
  clickSaveAndContinue();
});

When('the user provides a Local Planning Department not in the provided list', () => {
  provideLocalPlanningDepartment('An unknown LPA');
  clickSaveAndContinue();
});

When('the user selects the empty value from the list of Local Planning Departments', () => {
  selectLocalPlanningDepartmentWithoutJs('');
  clickSaveAndContinue();
});

When(
  'the user provides a Local Planning Department that is not participating in this service',
  () => {
    provideIneligibleLocalPlanningDepartment();
    clickSaveAndContinue();
  },
);

When(
  'the user selects a Local Planning Department that is not participating in this service',
  () => {
    selectIneligibleLocalPlanningDepartmentWithoutJs();
    clickSaveAndContinue();
  },
);

When('the user provides a Local Planning Department that is participating in this service', () => {
  provideEligibleLocalPlanningDepartment();
  clickSaveAndContinue();
});

When('the user selects a Local Planning Department that is participating in this service', () => {
  selectEligibleLocalPlanningDepartmentWithoutJs();
  clickSaveAndContinue();
});

Then(
  'the user is informed that the selected Local Planning Department is not participating in the service',
  () => {
    confirmLocalPlanningDepartmentIsNotParticipating();
  },
);

Then(
  'the user is informed that a Local Planning Department in the provided list is required',
  () => {
    confirmLocalPlanningDepartmentIsRequired();
  },
);

Then(
  'the user is informed that a Local Planning Department in the provided list must be selected',
  () => {
    confirmLocalPlanningDepartmentIsRequired();
  },
);

Then('the user can proceed with the provided Local Planning Department', () => {
  confirmProviedLocalPlanningDepartmentWasAccepted();
});

Then('the user can proceed and the appeal is updated with the Local Planning Department', () => {
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
  confirmEligibleLocalPlanningDepartment();
});

Then(
  'the user can proceed and the appeal is updated with the selected Local Planning Department',
  () => {
    goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPageWithoutJs);
    confirmEligibleLocalPlanningDepartmentWithoutJs();
  },
);

Then('appeal is updated with the ineligible Local Planning Department', () => {
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
  confirmIneligibleLocalPlanningDepartment();
});

Then('appeal is not updated with the unknown Local Planning Department', () => {
  confirmPlanningDepartmentSelected('');
});

Then('appeal Local Planning Department is not updated with the empty value', () => {
  confirmPlanningDepartmentSelectedWithoutJs('');
});

Given('LPD is requested', () => {
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPage);
});

When('an ineligible LPD is provided', () => {
  provideIneligibleLocalPlanningDepartment();
  clickSaveAndContinue();
});

When('an eligible LPD is provided', () => {
  provideEligibleLocalPlanningDepartment();
  clickSaveAndContinue();
});

And('the user can proceed to the Enforcement Notice eligibility check', () => {
  confirmNavigationEnforcementNoticePage();
  confirmTextOnPage('Have you received an enforcement notice?');
});

And('progress is halted with the message “This service is not available in your area”', () => {
  const heading = 'This service is not available in your area';
  confirmNavigationLocalPlanningDepartmentPage();
  cy.title().should('contain', heading);
  confirmTextOnPage(heading);
});
