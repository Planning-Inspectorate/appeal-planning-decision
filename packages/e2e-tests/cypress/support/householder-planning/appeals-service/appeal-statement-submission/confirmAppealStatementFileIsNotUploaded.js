import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmAppealStatementFileIsNotUploaded = () => {
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
  cy.get('#appeal-upload-file-name').should('not.exist');
  //cy.wait(Cypress.env('demoDelay'));
};
