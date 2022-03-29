import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { answerSiteHasNoIssues } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasNoIssues';
import { isSafetyIssuesInputPresented } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/isSafetyIssuesInputPresented';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { answerSiteHasIssues } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/answerSiteHasIssues';
import { provideSafetyIssuesConcerns } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/provideSafetyIssuesConcerns';
import { confirmHealthAndSafetyPage } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/confirmHealthAndSafetyPage';
import { confirmSiteHasIssuesAnswered } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/confirmSiteHasIssuesAnswered';
import { confirmSiteSafetyRejectedBecause } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/confirmSiteSafetyRejectedBecause';
import { confirmSafetyIssuesConcernsValue } from '../../../../../support/householder-planning/appeals-service/appeal-submission-site-health-and-safety-issues/confirmSafetyIssuesConcernsValue';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';
import {healthAndSafety} from "../../../../../support/householder-planning/appeals-service/page-objects/task-list-po";

const CONCERNS = "There's no roof and only one wall.";

Given('the status of the appeal section is displayed', () => {
  cy.url().should('contain',pageURLAppeal.goToTaskListPage);
});

Given(
  'the status of the appeal section is displayed with no health and safety issues previously reported',
  () => {
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    answerSiteHasNoIssues();
    isSafetyIssuesInputPresented(false);
    clickSaveAndContinue();
    cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  },
);

Given('health and safety issues along with concerns have been indicated', () => {
  healthAndSafety().click();
  answerSiteHasIssues();
  provideSafetyIssuesConcerns(CONCERNS);
  clickSaveAndContinue();
  healthAndSafety().click();
  cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
});

Given('no health and safety concerns have been indicated', () => {
  healthAndSafety().click();
  answerSiteHasNoIssues();
});

Given(
  'the status of the appeal section is displayed with some health and safety issues previously reported',
  () => {
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    answerSiteHasIssues();
    isSafetyIssuesInputPresented(true);
    provideSafetyIssuesConcerns(CONCERNS);
    clickSaveAndContinue();
    cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  },
);

Given('health and safety issues along with concerns have been provided', () => {
  cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  healthAndSafety().click();
  cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
  answerSiteHasIssues();
  isSafetyIssuesInputPresented(true);
  provideSafetyIssuesConcerns(CONCERNS);
  clickSaveAndContinue();
  cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  healthAndSafety().click();
  cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
});

Given(
  'health and safety issues and concerns previously indicated followed by an indication of no issues',
  () => {
    cy.url().should('contain',pageURLAppeal.goToTaskListPage);
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    answerSiteHasIssues();
    isSafetyIssuesInputPresented(true);
    provideSafetyIssuesConcerns(CONCERNS);
    clickSaveAndContinue();
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    answerSiteHasNoIssues();
  },
);

Given('confirmation of health and safety issues is requested', () => {
  cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  healthAndSafety().click();
  cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
});

When('health and safety issues is accessed', () => {
  cy.url().should('contain',pageURLAppeal.goToTaskListPage);
  healthAndSafety().click();
  cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
});

When('no confirmation of health and safety issues is provided', () => {
  clickSaveAndContinue();
});

When('confirmation of health and safety issues is provided along with concerns', () => {
  answerSiteHasIssues();
  provideSafetyIssuesConcerns(CONCERNS);
  clickSaveAndContinue();
});

When('confirmation of health and safety issues is provided without concerns', () => {
  answerSiteHasIssues();
  clickSaveAndContinue();
});

When('confirmation of no health and safety issues is provided', () => {
  answerSiteHasNoIssues();
  clickSaveAndContinue();
});

When(
  'confirmation of health and safety issues is provided along with concerns exceeding the limit',
  () => {
    const tooMuchIssues = 'x'.repeat(256);
    answerSiteHasIssues();
    provideSafetyIssuesConcerns(tooMuchIssues);
    clickSaveAndContinue();
  },
);

When('health and safety issues are indicated', () => {
  answerSiteHasIssues();
});

Then('the opportunity to provide health and safety issues is presented', () => {
  confirmHealthAndSafetyPage();
  confirmSiteHasIssuesAnswered('blank');
});

Then('health and safety issues along with concerns is presented', () => {
  confirmSiteHasIssuesAnswered('yes');
  isSafetyIssuesInputPresented(true);
});

Then('no health and safety issues is presented', () => {
  confirmSiteHasIssuesAnswered('no');
  isSafetyIssuesInputPresented(false);
});

Then('appeal is not updated because the health and safety concerns exceed the limit', () => {
  isSafetyIssuesInputPresented(true);
  confirmSiteSafetyRejectedBecause('Health and safety information must be 255 characters or fewer');
  confirmSiteHasIssuesAnswered('blank');
});

Then(
  'appeal is updated with health and safety issues and concerns and the appeal tasks are presented',
  () => {
    cy.url().should('contain',pageURLAppeal.goToTaskListPage);
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    confirmSiteHasIssuesAnswered('yes');
    confirmSafetyIssuesConcernsValue(CONCERNS);
   },
);

Then(
  'appeal is updated with no health and safety issues and the appeal tasks are presented',
  () => {
    cy.url().should('contain',pageURLAppeal.goToTaskListPage);
    healthAndSafety().click();
    cy.url().should('contain',pageURLAppeal.goToHealthAndSafetyPage);
    confirmSiteHasIssuesAnswered('no');
    confirmSafetyIssuesConcernsValue('');
  },
);

Then('health and safety issues along with concerns are presented', () => {
  confirmSafetyIssuesConcernsValue(CONCERNS);
});

Then('appeal is not updated because confirmation of health and safety issues is required', () => {
  confirmSiteSafetyRejectedBecause(
    'Select yes if there are any health and safety issues',
  );
  confirmSiteHasIssuesAnswered('blank');
});

Then('appeal is not updated because health and safety concerns are required', () => {
  confirmSiteSafetyRejectedBecause('Tell us about the health and safety issues');
  confirmSiteHasIssuesAnswered('blank');
});
