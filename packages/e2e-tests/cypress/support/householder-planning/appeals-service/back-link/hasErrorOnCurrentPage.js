import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const hasErrorOnCurrentPage = () => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);

  // submit the form without any input - invalid
  clickSaveAndContinue();

  // see error
  cy.get('[data-cy="error-wrapper"]').should('exist');
};
