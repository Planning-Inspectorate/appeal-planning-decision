import { goToFullAppealSubmitAppealTaskList } from './goToFullAppealSubmitAppealTaskList';
import { aboutAppealSiteSectionLink, checkYourAnswersLink, contactDetailsLink } from './page-objects/task-list-page-po';
import {
  contactDetailsEmail,
  contactDetailsFullName,
  originalApplicantYes,
} from './page-objects/original-applicant-or-not-po';
import { getSaveAndContinueButton } from '../../common-page-objects/common-po';
import { provideAddressLine1 } from '../../common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../common/appeal-submission-appeal-site-address/providePostcode';
import { selectNo, selectYes } from './page-objects/own-the-land-po';

export const declarationPageMethodsAppellant = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
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
  checkYourAnswersLink().click();
}
