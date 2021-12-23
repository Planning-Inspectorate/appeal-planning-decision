import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmOtherSiteOwnerToldAnswered = (answer) => {
  goToAppealsPage(pageURLAppeal.goToOtherSiteOwnerToldPage);

  if (answer === 'blank') {
    cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
    cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  } else {
    cy.get('[data-cy="answer-' + answer + '"]')
      .first()
      .should('be.checked');
  }

  //cy.wait(Cypress.env('demoDelay'));
};
