import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const provideAreYouOriginalApplicant = (value) => {
  goToAppealsPage('appellant-submission/who-are-you');
  if (value === 'yes') {
    cy.get('[data-cy="answer-yes"]').check();
  } else if(value === 'no'){
    cy.get('[data-cy="answer-no"]').check();
  }
};
