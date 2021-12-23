import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmSupportingDocumentAccepted = (filenames) => {
  //cy.goToSupportingDocumentsPage();
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);

  cy.get('.moj-multi-file-upload__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(filenames)) {
        filenames = [filenames];
      }
      filenames.forEach((filename) => expect(text).to.contain(filename));
    });

  cy.wait(Cypress.env('demoDelay'));
};
