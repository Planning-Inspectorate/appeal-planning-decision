import { validateIndividualFileUpload } from '../file-upload/validateIndividualFileUpload';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmAppealStatementFileIsUploaded = (filename) => {
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
  cy.get('#appeal-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  validateIndividualFileUpload('#appeal-upload-file-name');

  //cy.wait(Cypress.env('demoDelay'));
};
