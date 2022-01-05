import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const navigateToSubmissionInformationPage = () => {
  cy.get('[data-cy="submission-information-appeal-id"]')
    .should('not.be.visible')
    .invoke('val')
    .then((appealId) => {
      goToAppealsPage(`appellant-submission/submission-information/${appealId}`, {
        failOnStatusCode: false,
      });
      cy.wait(Cypress.env('demoDelay'));
    });
};
