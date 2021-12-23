import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

const { yourAppealDetailsPageHeadingSelector } = require('./selectors');

const defaultOptions = { script: true, failOnStatusCode: true };

export const appellantViewsYourAppealDetails = ({ script, failOnStatusCode } = defaultOptions) => {
  goToAppealsPage('your-planning-appeal/your-appeal-details', { script, failOnStatusCode });

  cy.title().should('eq', 'Your appeal details - Appeal a householder planning decision - GOV.UK');

  cy.get(yourAppealDetailsPageHeadingSelector)
    .invoke('text')
    .then((text) => text.trim())
    .should('eq', 'Your appeal details');

  cy.wait(Cypress.env('demoDelay'));
};
