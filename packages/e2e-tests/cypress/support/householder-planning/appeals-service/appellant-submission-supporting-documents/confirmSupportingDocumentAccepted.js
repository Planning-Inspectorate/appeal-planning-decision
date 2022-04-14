import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { validateIndividualFileUpload } from '../file-upload/validateIndividualFileUpload';

export const confirmSupportingDocumentAccepted = (filenames) => {
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);

  cy.get('#supporting-documents')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(filenames);
    });

  validateIndividualFileUpload('#supporting-documents');
};

