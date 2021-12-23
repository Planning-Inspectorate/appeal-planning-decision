import { eligibleDate } from '../../../../integration/householder-planning/appeals-service/eligibility-decision-date/eligibility-decision-date';
import { provideHouseholderAnswerYes } from '../eligibility-householder/provideHouseholderAnswerYes';
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { provideHouseholderPlanningPermissionStatusRefused } from '../eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusRefused';
import { provideDecisionDate } from '../eligibility-decision-date/provideDecisionDate';

export const navigateForwardsWithinEligibilitySteps = () => {
  cy.get('[data-cy="guidance-form-start"]').click();
  cy.wait(Cypress.env('demoDelay'));

  provideHouseholderAnswerYes();
  clickSaveAndContinue();

  provideHouseholderPlanningPermissionStatusRefused();
  clickSaveAndContinue();

  provideDecisionDate(eligibleDate);
};
