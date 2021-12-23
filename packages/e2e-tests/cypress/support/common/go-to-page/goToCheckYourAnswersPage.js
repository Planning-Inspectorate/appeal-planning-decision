import { goToAppealsPage } from './goToAppealsPage';

export const goToCheckYourAnswersPage = (options = {}) => {
  goToAppealsPage('appellant-submission/check-answers', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
