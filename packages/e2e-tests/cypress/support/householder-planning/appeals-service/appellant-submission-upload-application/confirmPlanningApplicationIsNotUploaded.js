import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmPlanningApplicationIsNotUploaded = () => {
  //cy.goToPlanningApplicationSubmission();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  cy.get('#application-upload-file-name').should('not.exist');
  cy.wait(Cypress.env('demoDelay'));
};
