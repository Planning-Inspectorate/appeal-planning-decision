import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { confirmPlanningApplicationNumberRejectedBecause } from '../appellant-submission-planning-application-number/confirmPlanningApplicationNumberRejectedBecause';
import { providePlanningApplicationNumber } from '../appellant-submission-planning-application-number/providePlanningApplicationNumber';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const hasErrorOnPreviousPage = () => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);

  // submit the form without any input
  clickSaveAndContinue();

  // invalid, see error
  confirmPlanningApplicationNumberRejectedBecause('Enter the original planning application number');
  cy.get('[data-cy="error-wrapper"]').should('exist');

  // now submit the valid form
  providePlanningApplicationNumber('FirstNumber/12345');
  clickSaveAndContinue();
};
