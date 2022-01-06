import { Given, When, Then, After } from 'cypress-cucumber-preprocessor/steps';
import { hasErrorOnPreviousPage } from '../../../../support/householder-planning/appeals-service/back-link/hasErrorOnPreviousPage';
import { hasErrorOnCurrentPage } from '../../../../support/householder-planning/appeals-service/back-link/hasErrorOnCurrentPage';
import { visitServiceByDirectlyBrowsingToUnexpectedFirstPage } from '../../../../support/householder-planning/appeals-service/back-link/visitServiceByDirectlyBrowsingToUnexpectedFirstPage';
import { navigateForwardsWithinEligibilitySteps } from '../../../../support/householder-planning/appeals-service/back-link/navigateForwardsWithinEligibilitySteps';
import { navigateForwardsWithinAppealSteps } from '../../../../support/householder-planning/appeals-service/back-link/navigateForwardsWithinAppealSteps';
import { provideDetailsAboutTheOriginalPlanningApplication } from '../../../../support/householder-planning/appeals-service/back-link/provideDetailsAboutTheOriginalPlanningApplication';
import { alterDetailsAboutVisitingTheAppealSite } from '../../../../support/householder-planning/appeals-service/back-link/alterDetailsAboutVisitingTheAppealSite';
import { clickBackLinkAndValidateUrl } from '../../../../support/householder-planning/appeals-service/back-link/clickBackLinkAndValidateUrl';
import { clickBackLink } from '../../../../support/householder-planning/appeals-service/back-link/clickBackLink';
import { validateBackLinkIsNotAvailable } from '../../../../support/householder-planning/appeals-service/back-link/validateBackLinkIsNotAvailable';
import { validateBackStepsWithinEligibilityJourney } from '../../../../support/householder-planning/appeals-service/back-link/validateBackStepsWithinEligibilityJourney';
import { validateBackStepsWithinAppealJourney } from '../../../../support/householder-planning/appeals-service/back-link/validateBackStepsWithinAppealJourney';
import { validateBackStepsFromOriginalPlanningApplicationToTaskList } from '../../../../support/householder-planning/appeals-service/back-link/validateBackStepsFromOriginalPlanningApplicationToTaskList';
import { validateBackStepsFromVisitingAppealSiteToCheckYourAnswers } from '../../../../support/householder-planning/appeals-service/back-link/validateBackStepsFromVisitingAppealSiteToCheckYourAnswers';
import { validateThePreviousPageDisplaysWithoutError } from '../../../../support/householder-planning/appeals-service/back-link/validateThePreviousPageDisplaysWithoutError';
import { validatePreviousPageDisplayedWithoutCurrentPageRefreshed } from '../../../../support/householder-planning/appeals-service/back-link/validatePreviousPageDisplayedWithoutCurrentPageRefreshed';
import { validateUserIsOnServiceStartPage } from '../../../../support/householder-planning/appeals-service/back-link/validateUserIsOnServiceStartPage';
import { validateBreadcrumbsAreVisible } from '../../../../support/householder-planning/appeals-service/back-link/validateBreadcrumbsAreVisible';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';
import {
  visitServiceStartPage
} from '../../../../support/householder-planning/appeals-service/back-link/visitServiceStartPage';

Given('an appellant or agent is checking their eligibility with JavaScript disabled', () => {
  //goToPageStartYourAppeal({ script: false });
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
});

Given('an appellant or agent is creating an appeal with JavaScript disabled', () => {
  //goToSiteAddressPage({ script: false });
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
});

Given('an appellant or agent is on the task list with JavaScript disabled', () => {
  //goToTaskListPage({ script: false });
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
});

Given('an appellant or agent is on check your answers with JavaScript disabled', () => {
  //goToCheckYourAnswersPage({ script: false });
  goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
});

Given('an appellant or agent is checking their eligibility with JavaScript enabled', () => {
  //goToPageStartYourAppeal({ script: true });
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
});

Given('an appellant or agent is creating an appeal with JavaScript enabled', () => {
  //goToSiteAddressPage();
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
});

Given('an appellant or agent is on the task list with JavaScript enabled', () => {
  //goToTaskListPage();
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
});

Given('an appellant or agent is on check your answers with JavaScript enabled', () => {
  //goToCheckYourAnswersPage();
  goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
});

Given('an appellant or agent had an error on the previous page', () => {
  hasErrorOnPreviousPage();
});

Given('an appellant or agent has an error on the current page', () => {
  hasErrorOnCurrentPage();
});

Given('an appellant or Agent didn’t come from a previous page in the service', () => {
  visitServiceByDirectlyBrowsingToUnexpectedFirstPage();
});

Given('an appellant or Agent visits the ‘Start’ page of the service', () => {
  visitServiceStartPage();
});

When('they navigate forwards within the eligibility steps', () => {
  navigateForwardsWithinEligibilitySteps();
});

When('they navigate forwards within the appeal steps', () => {
  navigateForwardsWithinAppealSteps();
});

When('they provide details about the original planning application', () => {
  provideDetailsAboutTheOriginalPlanningApplication();
});

When('they alter details about visiting the appeal site', () => {
  alterDetailsAboutVisitingTheAppealSite();
});

When('the appellant or agent uses the back link', () => {
  clickBackLinkAndValidateUrl({
    expectedUrl: /\/appellant-submission\/application-number$/,
  });
});

When('the appellant or agent selects to go back', () => {
  clickBackLink();
});

When('the appellant or agent wishes to go back', () => {
  validateBackLinkIsNotAvailable();
});

Then('they will be able to navigate back to the previous page within the eligibility steps', () => {
  validateBackStepsWithinEligibilityJourney();
});

Then('they will be able to navigate back to the previous page within the appeal steps', () => {
  validateBackStepsWithinAppealJourney();
});

Then(
  'they will be able to navigate back from the original planning application steps to the task list',
  () => {
    validateBackStepsFromOriginalPlanningApplicationToTaskList();
  },
);

Then(
  'they will be able to navigate back from the visiting the appeal site steps to check your answers',
  () => {
    validateBackStepsFromVisitingAppealSiteToCheckYourAnswers();
  },
);

Then('the page will be displayed without the error', () => {
  validateThePreviousPageDisplaysWithoutError();
});

Then('the previous page will be displayed without the current page being refreshed', () => {
  validatePreviousPageDisplayedWithoutCurrentPageRefreshed();
});

Then('they will be taken to the ‘Start’ page of the service', () => {
  validateUserIsOnServiceStartPage();
});

Then('they must use breadcrumbs or browser back button', () => {
  validateBreadcrumbsAreVisible();
});
