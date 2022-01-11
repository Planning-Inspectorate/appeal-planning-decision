import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { checkNoSensitiveInformation } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/checkNoSensitiveInformation';
import { uploadAppealStatementFile } from '../../../../support/householder-planning/appeals-service/appeal-statement-submission/uploadAppealStatementFile';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { uploadSupportingDocuments } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/uploadSupportingDocuments';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the "Appeal statement" is presented', () => {
 //goToAppealStatementSubmission();
  goToAppealsPage(pageURLAppeal.goToAppealStatementSubmission);
});

Given('the "Supporting documents" is presented', () => {
  //goToSupportingDocumentsPage();
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
});

When('the "Appeal statement" is submitted with valid values', () => {
  checkNoSensitiveInformation();
  uploadAppealStatementFile('appeal-statement-valid.pdf');
  clickSaveAndContinue();
});

When('the "Supporting documents" is submitted with valid values', () => {
  uploadSupportingDocuments('appeal-statement-valid.pdf');
  clickSaveAndContinue();
});
