import { providePlanningApplicationNumber } from '../appellant-submission-planning-application-number/providePlanningApplicationNumber';
import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { uploadPlanningApplicationFile } from '../appellant-submission-upload-application/uploadPlanningApplicationFile';

export const provideDetailsAboutTheOriginalPlanningApplication = () => {
  cy.get('[data-cy="applicationNumber"]').click();
  providePlanningApplicationNumber('ValidNumber/12345');
  clickSaveAndContinue();

  uploadPlanningApplicationFile('appeal-statement-valid.doc');
  clickSaveAndContinue();
};
