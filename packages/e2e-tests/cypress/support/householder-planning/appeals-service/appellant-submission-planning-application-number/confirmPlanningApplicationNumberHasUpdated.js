import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmPlanningApplicationNumberHasUpdated = (applicationNumber) => {
  goToAppealsPage('appellant-submission/application-number');
  cy.get('[data-cy="application-number"]').should('have.value', applicationNumber);
};
