import { provideHouseholderAnswerYes } from '../eligibility-householder/provideHouseholderAnswerYes';
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { provideHouseholderPlanningPermissionStatusRefused } from '../eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusRefused';
import { provideDecisionDate } from '../eligibility-decision-date/provideDecisionDate';
import {allowedDatePart, getPastDate} from "../../../common/getDate";
import {getDate, getMonth, getYear} from "date-fns";

export const navigateForwardsWithinEligibilitySteps = () => {
  cy.get('[data-cy="guidance-form-start"]').click();
  cy.wait(Cypress.env('demoDelay'));

  provideHouseholderAnswerYes();
  clickSaveAndContinue();

  provideHouseholderPlanningPermissionStatusRefused();
  clickSaveAndContinue();

  const validDate = getPastDate(allowedDatePart.WEEK, 7);
  provideDecisionDate( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );

};
