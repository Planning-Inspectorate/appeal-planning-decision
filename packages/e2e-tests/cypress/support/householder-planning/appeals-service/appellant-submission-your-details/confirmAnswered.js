import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmAnswered = (answer) => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
  cy.get('[data-cy="answer-' + answer + '"]')
    .first()
    .should('be.checked');
 // cy.wait(Cypress.env('demoDelay'));
};
