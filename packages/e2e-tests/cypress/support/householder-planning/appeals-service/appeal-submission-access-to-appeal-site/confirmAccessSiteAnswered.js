import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmAccessSiteAnswered = (answer, details) => {
  goToAppealsPage(pageURLAppeal.goToSiteAccessPage);

  cy.get('[data-cy="answer-' + answer + '"]')
    .first()
    .should('be.checked');

  if (answer === 'no') {
    cy.get('#site-access-more-detail').should('have.value', details);
  }
};
