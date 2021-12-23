import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { validateIndividualFileUpload } from '../file-upload/validateIndividualFileUpload';

export const confirmPlanningApplicationAccepted = (filename) => {
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
  cy.get('#application-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  validateIndividualFileUpload('#application-upload-file-name');

  cy.wait(Cypress.env('demoDelay'));
};
