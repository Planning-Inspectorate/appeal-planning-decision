import { goToAppealsPage } from '../../common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../common/accept-cookies-banner';
import { getSaveAndContinueButton } from '../../common-page-objects/common-po';
import { selectPlanningApplicationType } from '../../eligibility/planning-application-type/select-planning-application-type';
import { grantedOrRefused, noneOfTheseOption } from './page-objects/task-list-page-po';
import { allowedDatePart, getPastDate } from '../../common/getDate';
import { enterDateDecisionDue } from '../../eligibility/date-decision-due/enter-date-decision-due';
import { getDate, getMonth, getYear } from 'date-fns';
import { selectNo } from './page-objects/own-the-land-po';
import { getLocalPlanningDepart } from '../../eligibility/page-objects/local-planning-department-po';
import { enterDateDecisionReceived } from '../../eligibility/date-decision-received/enter-date-decision-received';

export const goToFullAppealSubmitAppealTaskList = (url, applicationType) =>  {
  goToAppealsPage(url);
  cy.url().should('include', url);
  acceptCookiesBanner();
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(applicationType);
  getSaveAndContinueButton().click();
  noneOfTheseOption().click();
  getSaveAndContinueButton().click();
  grantedOrRefused().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/decision-date');
  const validDate = getPastDate(allowedDatePart.MONTH, 1);
  enterDateDecisionReceived( {day: ("0" + getDate(validDate)).slice(-2), month: ("0" + (getMonth(validDate)+1)).slice(-2) , year: getYear(validDate) } );
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'before-you-start/enforcement-notice');
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'full-appeal/submit-appeal/task-list');
  cy.checkPageA11y();
}
