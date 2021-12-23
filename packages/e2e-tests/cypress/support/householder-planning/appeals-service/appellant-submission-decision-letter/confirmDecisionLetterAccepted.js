import { goToAppealsPage } from '../go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { validateIndividualFileUpload } from '../file-upload/validateIndividualFileUpload';

export const confirmDecisionLetterAccepted = (filename) => {
  //cy.goToDecisionLetterPage();
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  cy.get('#decision-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });

  validateIndividualFileUpload('#decision-upload-file-name');
};
