import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmDecisionLetterFileIsUploaded = (filename) => {
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  cy.get('#decision-upload-file-name')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filename);
    });
};
