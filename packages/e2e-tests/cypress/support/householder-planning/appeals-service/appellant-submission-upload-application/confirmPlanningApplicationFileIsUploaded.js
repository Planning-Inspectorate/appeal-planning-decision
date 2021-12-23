import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmPlanningApplicationFileIsUploaded = (filename) => {
  //cy.goToPlanningApplicationSubmission();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  cy.get('#application-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });
  cy.wait(Cypress.env('demoDelay'));
};
