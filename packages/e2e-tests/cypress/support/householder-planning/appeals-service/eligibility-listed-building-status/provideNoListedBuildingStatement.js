import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const provideNoListedBuildingStatement = () => {
  goToAppealsPage('eligibility/listed-building');

  cy.wait(Cypress.env('demoDelay'));
  clickSaveAndContinue();
  cy.wait(Cypress.env('demoDelay'));
};
