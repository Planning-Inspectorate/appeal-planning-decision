import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmAccessSiteNotSubmitted = () => {
  goToAppealsPage(pageURLAppeal.goToSiteAccessPage);
  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
};

