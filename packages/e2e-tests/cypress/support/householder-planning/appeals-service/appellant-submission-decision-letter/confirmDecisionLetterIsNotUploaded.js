import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmDecisionLetterIsNotUploaded = () => {
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
  cy.get('#decision-upload-file-name').should('not.exist');
};
