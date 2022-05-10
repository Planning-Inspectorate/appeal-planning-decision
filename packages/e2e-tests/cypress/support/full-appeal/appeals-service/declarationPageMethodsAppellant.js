import {
  aboutAppealSiteSectionLink,
  checkYourAnswersLink,
  contactDetailsLink,
  appealDocumentsSectionLink,
  planningApplicationDocumentsLink,
} from './page-objects/task-list-page-po';
import {
  contactDetailsEmail,
  contactDetailsFullName,
  originalApplicantYes,
} from './page-objects/original-applicant-or-not-po';
import { getSaveAndContinueButton, getFileUploadButton } from '../../common-page-objects/common-po';
import { provideAddressLine1 } from '../../common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../common/appeal-submission-appeal-site-address/providePostcode';
import { selectNo, selectYes } from './page-objects/own-the-land-po';
import { linkDecideYourAppeal } from './page-objects/appeal-form-task-list-po';
import {
  planningApplicationNumber,
} from './page-objects/planning-application-number-po';
import { submitADesignStNo } from './page-objects/design-access-statement-submitted-po';
import { checkboxConfirmSensitiveInfo } from './page-objects/your-appeal-statement-po';
import {
  selectWrittenRepresentations,
} from './page-objects/decide-your-appeal-po';
import { selectApplicationCertificatesIncluded } from './selectApplicationCertificatesIncluded';

export const declarationPageMethodsAppellant = (count) => {
  // goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-department','Full planning');
  contactDetailsLink().click();
  originalApplicantYes().click();
  getSaveAndContinueButton().click();
  contactDetailsFullName().clear().type('Original Applicant Teddy');
  contactDetailsEmail().clear().type('teddy@gmail.com');
  getSaveAndContinueButton().click();

  aboutAppealSiteSectionLink().click();
  provideAddressLine1('101 Bradmore Way, Reading');
  providePostcode('RG6 1DC');
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
  selectApplicationCertificatesIncluded('Yes');
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
