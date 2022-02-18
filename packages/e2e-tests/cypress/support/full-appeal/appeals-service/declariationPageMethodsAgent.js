import { goToFullAppealSubmitAppealTaskList } from './goToFullAppealSubmitAppealTaskList';
import { aboutAppealSiteSectionLink, checkYourAnswersLink, contactDetailsLink } from './page-objects/task-list-page-po';
import {
  applicantCompanyName, contactDetailsEmail, contactDetailsFullName,
  originalApplicantName,
  originalApplicantNo,
} from './page-objects/original-applicant-or-not-po';
import { getSaveAndContinueButton } from '../../common-page-objects/common-po';
import { provideAddressLine1 } from '../../common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../common/appeal-submission-appeal-site-address/providePostcode';
import { selectNo, selectYes } from './page-objects/own-the-land-po';

export const declariationPageMethodsAgent = () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
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
  checkYourAnswersLink().click();
}
