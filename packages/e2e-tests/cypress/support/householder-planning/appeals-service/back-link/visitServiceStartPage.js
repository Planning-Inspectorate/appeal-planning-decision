import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const visitServiceStartPage = (options = {}) => {
  goToAppealsPage('', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
