import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmWholeSiteOwnerAnswered= (answer) => {
  goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);

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
