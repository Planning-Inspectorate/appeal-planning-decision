import {
  aboutAppealSiteSectionLink,
  checkYourAnswersLink,
  contactDetailsLink,
  appealDocumentsSectionLink,
  planningApplicationDocumentsLink,
} from './page-objects/task-list-page-po';
import {
  applicantCompanyName, contactDetailsEmail, contactDetailsFullName,
  originalApplicantName,
  originalApplicantNo,
} from './page-objects/original-applicant-or-not-po';
import { getSaveAndContinueButton, getFileUploadButton } from '../../common-page-objects/common-po';
import { provideAddressLine1 } from '../../common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../common/appeal-submission-appeal-site-address/providePostcode';
import { selectNo, selectYes } from './page-objects/own-the-land-po';
import { linkDecideYourAppeal } from './page-objects/appeal-form-task-list-po';
import {
  selectWrittenRepresentations,
} from './page-objects/decide-your-appeal-po';
import {
  planningApplicationNumber,
} from './page-objects/planning-application-number-po';
import { submitADesignStNo } from './page-objects/design-access-statement-submitted-po';
import { checkboxConfirmSensitiveInfo } from './page-objects/your-appeal-statement-po';
import { selectApplicationCertificatesSeparate } from './selectApplicationCertificatesSeparate';

export const declariationPageMethodsAgent = () => {
  //  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-department','Full planning');

  contactDetailsLink().click();
  originalApplicantNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', 'full-appeal/submit-appeal/applicant-name');
  originalApplicantName().clear().type('Original applicant is Rose');
  applicantCompanyName().clear().type('Applicant company Ltd');
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type('Agent Zoopla');
  contactDetailsEmail().clear().type('agent@gmail.com');
  getSaveAndContinueButton().click();
  aboutAppealSiteSectionLink().click();
  provideAddressLine1('303 Rogerstone Newport');
  providePostcode('NP10 9FG');
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectYes().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();

  linkDecideYourAppeal().click();
  selectWrittenRepresentations().click();
  getSaveAndContinueButton().click();

  planningApplicationDocumentsLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();
  selectApplicationCertificatesSeparate('No');
  planningApplicationNumber().type('PNO-1001');
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('upload-file-valid.pdf');
  getSaveAndContinueButton().click();
  submitADesignStNo().click();
  getSaveAndContinueButton().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  getSaveAndContinueButton().click();

  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile('appeal-statement-valid.jpeg');
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();
  selectNo().click();
  getSaveAndContinueButton().click();

  checkYourAnswersLink().click();
};
