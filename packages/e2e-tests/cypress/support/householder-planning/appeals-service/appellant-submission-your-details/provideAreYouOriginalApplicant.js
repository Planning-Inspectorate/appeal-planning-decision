import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const provideAreYouOriginalApplicant= (value) => {
  goToAppealsPage('appellant-submission/who-are-you');
  if (value === 'are') {
    cy.get('[data-cy="answer-yes"]').check();
  } else {
    cy.get('[data-cy="answer-no"]').check();
  }
  //cy.wait(Cypress.env('demoDelay'));
};
