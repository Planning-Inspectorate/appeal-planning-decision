import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmPlanningApplicationNumberHasNotUpdated = () => {
  goToAppealsPage('appellant-submission/application-number');
  cy.get('[data-cy="application-number"].value').should('not.exist');
};
