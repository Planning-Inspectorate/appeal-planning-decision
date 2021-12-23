import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmApplicantNameValue = (applicantName) => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
  //cy.wait(Cypress.env('demoDelay'));
  cy.get('#behalf-appellant-name').should('have.value', applicantName);
  //cy.wait(Cypress.env('demoDelay'));
};
