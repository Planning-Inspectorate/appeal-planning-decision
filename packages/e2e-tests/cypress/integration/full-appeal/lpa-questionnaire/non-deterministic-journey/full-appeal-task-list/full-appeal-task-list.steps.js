import {Before, Given, Then} from "cypress-cucumber-preprocessor/steps";
import {goToFullAppealLpaPage} from "../../../../../support/common/go-to-page/goToFullAppealLpaPage";
import {verifyPageHeading} from "../../../../../support/common/verify-page-heading";
import {verifyPageTitle} from "../../../../../support/common/verify-page-title";
import {
  completeNonDeterministicFullAppeal
} from "../../../../../support/full-appeal/lpa-questionnaire/completeNonDeterministicFullAppeal";
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
  consultationResponseReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/consultationResponseReviewTask";
import {
  decisionNoticeReviewTask
} from "../../../../../support/full-appeal/lpa-questionnaire/task-list/decisionNoticeReviewTask";
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
Given('a non-deterministic full appeal has been created',()=>{
  completeNonDeterministicFullAppeal();
});

Given('the LPA accesses the link to the non-deterministic questionnaire',()=>{
  goToFullAppealLpaPage(page.url);
  verifyPageHeading(page.pageHeading);
  verifyPageTitle(page.pageTitle);
  applicationStatusDetails();
});

Then('the non-deterministic tasks are presented with a {string} status',(status)=>{
  if(status==='Not Started') {
    procedureTypeReviewTask();
    issuesConstraintsDesignationReviewTask();
    environmentalImpactAssessmentReviewTask();
    peopleNotificationReviewTask();
    consultationResponseReviewTask();
    decisionNoticeReviewTask();
    siteAccessReviewTask();
    additionalInformationReviewTask();
  }
});

Then('the non-deterministic task Check your answers has a status of {string}',(status)=>{
  if(status==='Cannot start yet')
  questionnaireSubmissionReviewTask();
})
