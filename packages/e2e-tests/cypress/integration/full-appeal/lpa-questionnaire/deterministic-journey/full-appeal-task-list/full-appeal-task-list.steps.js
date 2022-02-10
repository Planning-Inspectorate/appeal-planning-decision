import {Before, Given, Then} from "cypress-cucumber-preprocessor/steps";
import {goToFullAppealLpaPage} from "../../../../../support/common/go-to-page/goToFullAppealLpaPage";
import {
  completeDeterministicFullAppeal
} from "../../../../../support/full-appeal/lpa-questionnaire/completeDeterministicFullAppeal";
import {verifyPageHeading} from "../../../../../support/common/verify-page-heading";
import {verifyPageTitle} from "../../../../../support/common/verify-page-title";
import {
  procedureTypeReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/procedureTypeReviewTask";
import {
  issuesConstraintsDesignationReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/issuesConstraintsDesignationReviewTask";
import {
  environmentalImpactAssessmentReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/environmentalImpactAssessmentReviewTask";
import {
  peopleNotificationReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/peopleNotificationReviewTask";
import {
  siteAccessReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/siteAccessReviewTask";
import {
  additionalInformationReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/additionalInformationReviewTask";
import {
  questionnaireSubmissionReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/questionnaireSubmissionReviewTask";
import {
  consultationResponseReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/consultationResponseReviewTask";
import {
  planningOfficerReportReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/planningOfficerReportReviewTask";
import {
  applicationStatusDetails
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/applicationStatusDetails";

const page = {
  url: 'questionnaire/task-list',
  pageHeading: 'Full planning appeal questionnaire',
  pageTitle: 'Full planning appeal questionnaire - Appeal a planning decision - GOV.UK'
}
Before(() => {
  cy.wrap(page).as('page');
});
Given('a deterministic full appeal has been created',()=>{
  completeDeterministicFullAppeal();
});

Given('the LPA accesses the link to the deterministic questionnaire',()=>{
  goToFullAppealLpaPage(page.url);
  verifyPageHeading(page.pageHeading);
  verifyPageTitle(page.pageTitle);
  applicationStatusDetails();

});

Then('the deterministic tasks are presented with a {string} status',(status)=>{
  if(status==='Not Started') {
   procedureTypeReviewTask();
    issuesConstraintsDesignationReviewTask();
    environmentalImpactAssessmentReviewTask();
    peopleNotificationReviewTask();
    planningOfficerReportReviewTask();
   consultationResponseReviewTask();
    siteAccessReviewTask();
    additionalInformationReviewTask();
  }
});

Then('the deterministic task Check your answers has a status of {string}',(status)=>{
  if(status==='Cannot start yet')
  questionnaireSubmissionReviewTask();
})
