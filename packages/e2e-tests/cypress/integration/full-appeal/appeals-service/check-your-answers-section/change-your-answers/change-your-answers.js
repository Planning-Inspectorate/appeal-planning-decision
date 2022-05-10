import {Then, When} from 'cypress-cucumber-preprocessor/steps';
import {
  getAdvertisingYourAppealAnswerCopyOfForm,
  getAdvertisingYourAppealAnswerInThePress,
  getAdvertisingYourAppealAnswerLast21Days,
  getAdvertisingYourAppealChangeLink,
  getAdvertisingYourAppealQuestion,
  getAgriculturalHoldingAnswer,
  getAgriculturalHoldingChangeLink,
  getAgriculturalHoldingOtherTenantAnswer,
  getAgriculturalHoldingOtherTenantChangeLink,
  getAgriculturalHoldingOtherTenantQuestion,
  getAgriculturalHoldingQuestion,
  getAgriculturalHoldingTenantAnswer,
  getAgriculturalHoldingTenantChangeLink,
  getAgriculturalHoldingTenantQuestion,
  getAppealSiteAddressAnswer,
  getAppealSiteAddressChangeLink,
  getAppealSiteAddressQuestion,
  getAppealStatementAnswer,
  getAppealStatementChangeLink,
  getAppealStatementQuestion,
  getDecisionLetterAnswer,
  getDecisionLetterChangeLink,
  getDecisionLetterQuestion,
  getDesignAccessStatementAnswer,
  getDesignAccessStatementChangeLink,
  getDesignAccessStatementQuestion,
  getDesignAccessStatementSubmittedAnswer,
  getDesignAccessStatementSubmittedChangeLink,
  getDesignAccessStatementSubmittedQuestion,
  getDocumentsToSupportAppealAnswer,
  getDocumentsToSupportAppealChangeLink,
  getDocumentsToSupportAppealQuestion,
  getHealthAndSafetyIssuesAnswer,
  getHealthAndSafetyIssuesChangeLink,
  getHealthAndSafetyIssuesDetails,
  getHealthAndSafetyIssuesQuestion,
  getIdentifyOtherLandownersAnswer,
  getIdentifyOtherLandownersChangeLink,
  getIdentifyOtherLandownersQuestion,
  getNumberOfDaysForInquiryAnswer,
  getNumberOfDaysForInquiryChangeLink,
  getNumberOfDaysForInquiryQuestion,
  getOwnsAllTheLandInvolvedAnswer,
  getOwnsAllTheLandInvolvedChangeLink,
  getOwnsAllTheLandInvolvedQuestion,
  getOwnsRestOfTheLandInvolvedAnswer,
  getOwnsRestOfTheLandInvolvedChangeLink,
  getOwnsRestOfTheLandInvolvedQuestion,
  getPlanningAppContactDetailsChangeLink,
  getPlanningAppContactDetailsCompanyAnswer,
  getPlanningAppContactDetailsEmailAnswer,
  getPlanningAppContactDetailsNameAnswer,
  getPlanningAppContactDetailsQuestion,
  getPlanningApplicationFormAnswer,
  getPlanningApplicationFormChangeLink,
  getPlanningApplicationFormQuestion,
  getPlanningApplicationNumberAnswer,
  getPlanningApplicationNumberChangeLink,
  getPlanningApplicationNumberQuestion,
  getPlanningAppMadeInYourNameAnswer,
  getPlanningAppMadeInYourNameChangeLink,
  getPlanningAppMadeInYourNameQuestion,
  getPlanningAppMadeOnBehalfOfChangeLink,
  getPlanningAppMadeOnBehalfOfCompanyAnswer,
  getPlanningAppMadeOnBehalfOfNameAnswer,
  getPlanningAppMadeOnBehalfOfQuestion,
  getPlansDrawingSupportingDocumentsAnswer,
  getPlansDrawingSupportingDocumentsChangeLink,
  getPlansDrawingSupportingDocumentsQuestion,
  getPlansOrDrawingAnswer,
  getPlansOrDrawingChangeLink,
  getPlansOrDrawingQuestion,
  getPlansOrDrawingSupportingAnswer,
  getPlansOrDrawingSupportingChangeLink,
  getPlansOrDrawingSupportingQuestion,
  getPreferAHearingAnswer,
  getPreferAHearingChangeLink,
  getPreferAHearingQuestion,
  getPreferAnInquiryAnswer,
  getPreferAnInquiryChangeLink,
  getPreferAnInquiryQuestion,
  getProcedureTypeAnswer,
  getProcedureTypeChangeLink,
  getProcedureTypeQuestion,
  getStatementOfCommonGroundAnswer,
  getStatementOfCommonGroundChangeLink,
  getStatementOfCommonGroundQuestion,
  getSupportingDocumentsAppealAnswer,
  getSupportingDocumentsAppealChangeLink,
  getSupportingDocumentsAppealQuestion,
  getTellingTheOtherLandownersAnswerAllOtherLandowners,
  getTellingTheOtherLandownersAnswerCopyOfForm,
  getTellingTheOtherLandownersAnswerLast21Days,
  getTellingTheOtherLandownersChangeLink,
  getTellingTheOtherLandownersQuestion,
  getTellingTheOtherTenantsAnswerAllOtherTenants,
  getTellingTheOtherTenantsAnswerCopyOfForm,
  getTellingTheOtherTenantsAnswerLast21Days,
  getTellingTheOtherTenantsChangeLink,
  getTellingTheOtherTenantsQuestion,
  getVisibleFromPublicLandAnswer,
  getVisibleFromPublicLandChangeLink,
  getVisibleFromPublicLandQuestion,
  getVisibleFromPublicRoadDetails,
} from '../../../../../support/full-appeal/appeals-service/page-objects/check-your-answers-po';
import {
  applicantCompanyName,
  contactDetailsCompanyName,
  contactDetailsEmail,
  contactDetailsFullName,
  originalApplicantName,
  originalApplicantNo,
  originalApplicantYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import {
  getSaveAndContinueButton
} from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

import {
  verifyFullAppealCYAQuestion
} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAQuestion";
import {
  verifyFullAppealCYAChangLink
} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAChangLink";
import {
  verifyFullAppealCYAAnswer
} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAAnswer";
import {
  selectHearing,
  selectInquiry,
  selectWrittenRepresentations,
  textBoxExpectDays,
  textBoxInquiry,
  textBoxWhyHearing
} from "../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po";
import {getFileUploadButton} from "../../../../../support/common-page-objects/common-po";
import {
  planningApplicationNumber
} from "../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po";
import {
  advertisingYourAppealToldAboutAppeal,
  advertisingYourAppealUseCopyOfTheForm,
  advertisingYourAppealWithinLast21Days,
  checkBoxIdentifyingTheOwners,
  selectNo,
  selectYes,
  tellingTheLandOwnersToldAboutAppeal,
  tellingTheLandOwnersUseCopyOfTheForm,
  tellingTheLandOwnersWithinLast21Days,
  tellingTheTenantsCopyOfTheForm,
  tellingTheTenantsToldAboutAppeal,
  tellingTheTenantsWithinLast21Days
} from "../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po";
import {
  provideAddressLine1
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1";
import {
  provideAddressLine2
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2";
import {provideTownOrCity} from "../../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity";
import {provideCounty} from "../../../../../support/common/appeal-submission-appeal-site-address/provideCounty";
import {providePostcode} from "../../../../../support/common/appeal-submission-appeal-site-address/providePostcode";
import {
  notVisibleFromLandProvideDetails
} from "../../../../../support/full-appeal/appeals-service/page-objects/visible-from-road-po";
import {
  healthAndSafetyIssuesProvideDetails
} from "../../../../../support/full-appeal/appeals-service/page-objects/health-safety-issues-po";
import {selectTheOwners} from "../../../../../support/full-appeal/appeals-service/selectTheOwners";
import { selectApplicationCertificatesIncluded } from '../../../../../support/full-appeal/appeals-service/selectApplicationCertificatesIncluded';

const applicantName = 'Original applicant Teddy';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const agentFullNameText = 'Agent Zoopla';
const agentCompanyNameText = 'Agent Zoopla Test Company Ltd';
const agentEmailText = 'agent-zoopla@hotmail.com';
const originalAppellantFullNameText = 'Original Appellant Teddy';
const originalAppellantCompanyNameText = 'Original Appellant Test Company Ltd';
const originalAppellantEmailText = 'original-appellant@gmail.com';
const addressLine1 = '10 Bradmore Way';
const addressLine2 = 'Clifton';
const townCity = 'Bristol';
const county = 'South Glos';
const postcode = 'BS8 1TG';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const agriculturalLandHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const visibleFromPublicLandUrl = 'full-appeal/submit-appeal/visible-from-road';
const healthAndSafetyUrl = 'full-appeal/submit-appeal/health-safety-issues';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const whyHearingUrl = 'full-appeal/submit-appeal/why-hearing';
const textHearing = 'I want to provide the facts of the Appeal for the formal decision';
const daysToExpectTheInquiryUrl = 'full-appeal/submit-appeal/expect-inquiry-last';
const planningAppNumberUrl = 'full-appeal/submit-appeal/application-number';
const advertisingTheAppealUrl = '/full-appeal/submit-appeal/advertising-your-appeal';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const designAccessStatementSubmittedUrl =
  'full-appeal/submit-appeal/design-access-statement-submitted';
const tellingTheLandownersUrl = '/full-appeal/submit-appeal/telling-the-landowners';
const identifyingTheOwnersUrl = '/full-appeal/submit-appeal/identifying-the-owners';
const designAccessStatementUrl = 'full-appeal/submit-appeal/design-access-statement';
const areYouTenantUrl = '/full-appeal/submit-appeal/are-you-a-tenant';
const otherTenantsUrl = '/full-appeal/submit-appeal/other-tenants';
const tellingTheTenantsUrl = '/full-appeal/submit-appeal/telling-the-tenants';
const decisionLetterUrl = 'full-appeal/submit-appeal/decision-letter';
const whyInquiryUrl = 'full-appeal/submit-appeal/why-inquiry';
const planningAppNumberText = 'PNO-TEST123';
const textInquiry = 'I want to take part in the inquiry process - 123456789';
const plansDrawingsUrl = 'full-appeal/submit-appeal/plans-drawings';
const newPlansAndDrawingsUrl = 'full-appeal/submit-appeal/new-plans-drawings';
const supportingDocumentsUrl = 'full-appeal/submit-appeal/supporting-documents';
const newSupportingDocumentsUrl = 'full-appeal/submit-appeal/new-supporting-documents';
const planningAppFormDocument = 'upload-file-valid.jpeg';
const decisionLetter = 'upload-file-valid.pdf';
const appealStatement = 'upload-file-valid.jpeg';
const draftStatementDocument = 'upload-file-valid.png';
const draftStatementUrl = 'full-appeal/submit-appeal/draft-statement-common-ground';
const validNumberDays = '10';
const designAccessStatementDocument = 'upload-file-valid.tiff';
const plansAndDrawings = 'upload-file-valid.tif';
const supportingDocument = 'upload-file-valid.docx';
const visibleFromRoadText = 'Site is behind a tall wall';
const healthAndSafetyConcern = 'The site has no mobile reception';
const plansAndDrawingsDocumentsUrl = 'full-appeal/submit-appeal/plans-drawings-documents';
const plansAndDrawingsDocument = 'upload-file-valid.pdf';

When('appellant selects to change answers for {string}', (change_question) => {
  switch (change_question) {
    case 'Was the planning application made in your name?':
      getPlanningAppMadeInYourNameChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/original-applicant');
      break;
    case 'Your contact details':
      getPlanningAppContactDetailsChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/contact-details');
      break;
    case 'Appeal made on behalf of':
      getPlanningAppMadeOnBehalfOfChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/applicant-name');
      break;
    case 'How would you prefer us to decide your appeal?':
      getProcedureTypeChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/how-decide-appeal');
      break;
    case 'Why would you prefer a hearing?':
      getPreferAHearingChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/why-hearing');
      break;
    case 'Draft statement of common ground':
      getStatementOfCommonGroundChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/draft-statement-common-ground');
      break;
    case 'Why would you prefer an inquiry?':
      getPreferAnInquiryChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/why-inquiry');
      break;
    case 'How many days would you expect the inquiry to last?':
      getNumberOfDaysForInquiryChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/expect-inquiry-last');
      break;
    case 'Planning application form':
      getPlanningApplicationFormChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/application-form');
      break;
    case 'Planning application number':
      getPlanningApplicationNumberChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/application-number');
      break;
    case 'Plans, drawings and supporting documents':
      getPlansDrawingSupportingDocumentsChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/plans-drawings-documents');
      break;
    case 'Design and access statement submitted with application':
      getDesignAccessStatementSubmittedChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/design-access-statement-submitted');
      break;
    case 'Decision letter':
      getDecisionLetterChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/decision-letter');
      break;
    case 'Design and access statement':
      getDesignAccessStatementChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/design-access-statement');
      break;
    case 'Appeal statement':
      getAppealStatementChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/appeal-statement');
      break;
    case 'Any plans or drawings to support your appeal':
      getPlansOrDrawingSupportingChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/plans-drawings');
      break;
    case 'Any documents to support your appeal':
      getDocumentsToSupportAppealChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/supporting-documents');
      break;
    case 'Plans and drawings':
      getPlansOrDrawingChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/new-plans-drawings');
      break;
    case 'Supporting documents':
      getSupportingDocumentsAppealChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/new-supporting-documents');
      break;
    case 'Appeal site address':
      getAppealSiteAddressChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/appeal-site-address');
      break;
    case 'Do you own the land involved in the appeal?':
      getOwnsAllTheLandInvolvedChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/own-all-the-land');
      break;
    case 'Is the appeal site part of an agricultural holding?':
      getAgriculturalHoldingChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/agricultural-holding');
      break;
    case 'Visible from a public road':
      getVisibleFromPublicLandChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/visible-from-road');
      break;
    case 'Health and safety issues':
      getHealthAndSafetyIssuesChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/health-safety-issues');
      break;
    case 'Are you a tenant of the agricultural holding?':
      getAgriculturalHoldingTenantChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/are-you-a-tenant');
      break;
    case 'Are there any other tenants?':
      getAgriculturalHoldingOtherTenantChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/other-tenants');
      break;
    case 'Do you know who owns the rest of the land involved in the appeal?':
      getOwnsRestOfTheLandInvolvedChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/know-the-owners');
      break;
    case 'Do you know who owns the land involved in the appeal?':
      getOwnsRestOfTheLandInvolvedChangeLink().click();
      cy.url().should('contain', 'full-appeal/submit-appeal/know-the-owners');
      break;
  }
});

When('appellant provides the {string} for contact details section', (change_answer) => {
  let change_answers = change_answer.split(',');
  switch (change_answers[0]) {
    case 'appellant':
      originalApplicantYes().click();
      getSaveAndContinueButton().click();
      contactDetailsFullName().clear().type(originalAppellantFullNameText);
      contactDetailsCompanyName().clear().type(originalAppellantCompanyNameText);
      contactDetailsEmail().clear().type(originalAppellantEmailText);
      getSaveAndContinueButton().click();
      break;
    case 'agent':
      originalApplicantNo().click();
      getSaveAndContinueButton().click();
      originalApplicantName().clear().type(applicantName);
      applicantCompanyName().clear().type(originalAppellantCompanyNameText);
      getSaveAndContinueButton().click();
      contactDetailsFullName().clear().type(agentFullNameText);
      contactDetailsCompanyName().clear().type(agentCompanyNameText);
      contactDetailsEmail().clear().type(agentEmailText);
      getSaveAndContinueButton().click();
      break;
    case 'appellant_new_contact':
      contactDetailsFullName().clear().type(change_answers[1].trim());
      contactDetailsCompanyName().clear().type(change_answers[2].trim());
      contactDetailsEmail().clear().type(change_answers[3].trim());
      getSaveAndContinueButton().click();
      break;
    case 'agent_new_contact':
      contactDetailsFullName().clear().type(change_answers[1].trim());
      contactDetailsCompanyName().clear().type(change_answers[2].trim());
      contactDetailsEmail().clear().type(change_answers[3].trim());
      getSaveAndContinueButton().click();
      break;
    case 'agent_appeal_on_behalf_of':
      originalApplicantName().clear().type(change_answers[1].trim());
      applicantCompanyName().clear().type(change_answers[2].trim());
      getSaveAndContinueButton().click();
      contactDetailsFullName().clear().type(change_answers[3].trim());
      contactDetailsCompanyName().clear().type(change_answers[4].trim());
      contactDetailsEmail().clear().type(change_answers[5].trim());
      getSaveAndContinueButton().click();
      break;
  }
});

When(
  'appellant provides the {string} for {string} for deciding your appeal section',
  (change_answer, change_question) => {
    const change_answers = change_answer.split(',');
    if (change_question === 'How would you prefer us to decide your appeal?') {
      switch (change_answers[0]) {
        case 'Written representations':
          selectWrittenRepresentations().click();
          getSaveAndContinueButton().click();
          break;
        case 'Inquiry':
          selectInquiry().click();
          getSaveAndContinueButton().click();
          cy.url().should('include', whyInquiryUrl);
          textBoxInquiry().clear().type(textInquiry);
          getSaveAndContinueButton().click();
          cy.url().should('include', daysToExpectTheInquiryUrl);
          textBoxExpectDays().clear().type(validNumberDays);
          getSaveAndContinueButton().click();
          cy.url().should('include', draftStatementUrl);
          getFileUploadButton().attachFile(draftStatementDocument);
          getSaveAndContinueButton().click();
          break;
        case 'Hearing':
          selectHearing().click();
          getSaveAndContinueButton().click();
          cy.url().should('include', whyHearingUrl);
          textBoxWhyHearing().clear().type(textHearing);
          getSaveAndContinueButton().click();
          cy.url().should('include', draftStatementUrl);
          getFileUploadButton().attachFile(draftStatementDocument);
          getSaveAndContinueButton().click();
          break;
      }
    } else if (change_question === 'Why would you prefer a hearing?') {
      textBoxWhyHearing().clear().type(change_answers[0]);
      getSaveAndContinueButton().click();
      cy.url().should('include', draftStatementUrl);
      getFileUploadButton().attachFile(draftStatementDocument);
      getSaveAndContinueButton().click();
    } else if (change_question === 'Draft statement of common ground') {
      cy.url().should('include', draftStatementUrl);
      getFileUploadButton().attachFile(change_answers[0]);
      getSaveAndContinueButton().click();
    } else if (change_question === 'Why would you prefer an inquiry?') {
      textBoxInquiry().clear().type(change_answers[0]);
      getSaveAndContinueButton().click();
      cy.url().should('include', daysToExpectTheInquiryUrl);
      textBoxExpectDays().clear().type(validNumberDays);
      getSaveAndContinueButton().click();
      cy.url().should('include', draftStatementUrl);
      getFileUploadButton().attachFile(draftStatementDocument);
      getSaveAndContinueButton().click();
    } else if (change_question === 'How many days would you expect the inquiry to last?') {
      textBoxExpectDays().clear().type(change_answer);
      getSaveAndContinueButton().click();
      cy.url().should('include', draftStatementUrl);
      getFileUploadButton().attachFile(draftStatementDocument);
      getSaveAndContinueButton().click();
    }
  },
);

When(
  'appellant provides the {string} for {string} for planning application section',
  (change_answer, change_link_question) => {
    const change_answers = change_answer.split(',');
    switch (change_link_question) {
      case 'Planning application form':
        getFileUploadButton().attachFile(change_answers[0].trim());
        getSaveAndContinueButton().click();
        selectApplicationCertificatesIncluded('Yes');
        cy.url().should('contain', planningAppNumberUrl);
        planningApplicationNumber().clear().type(planningAppNumberText);
        getSaveAndContinueButton().click();
        cy.url().should('contain', plansAndDrawingsDocumentsUrl);
        getFileUploadButton().attachFile(plansAndDrawingsDocument);
        getSaveAndContinueButton().click();
        cy.url().should('contain', designAccessStatementSubmittedUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', decisionLetterUrl);
        getFileUploadButton().attachFile(decisionLetter);
        getSaveAndContinueButton().click();
        break;
      case 'Planning application number':
        planningApplicationNumber().clear().type(change_answers[0].trim());
        getSaveAndContinueButton().click();
        cy.url().should('contain', plansAndDrawingsDocumentsUrl);
        getFileUploadButton().attachFile(plansAndDrawingsDocument);
        getSaveAndContinueButton().click();
        cy.url().should('contain', designAccessStatementSubmittedUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', decisionLetterUrl);
        getFileUploadButton().attachFile(decisionLetter);
        getSaveAndContinueButton().click();
        break;
      case 'Plans, drawings and supporting documents':
        getFileUploadButton().attachFile(change_answers[0].trim());
        getSaveAndContinueButton().click();
        cy.url().should('contain', designAccessStatementSubmittedUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', decisionLetterUrl);
        getFileUploadButton().attachFile(decisionLetter);
        getSaveAndContinueButton().click();
        break;
      case 'Decision letter':
        getFileUploadButton().attachFile(change_answers[0].trim());
        getSaveAndContinueButton().click();
    }
    if (
      change_link_question === 'Design and access statement submitted with application' &&
      change_answers[0].trim() === 'yes'
    ) {
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', designAccessStatementUrl);
      getFileUploadButton().attachFile(designAccessStatementDocument);
      getSaveAndContinueButton().click();
      cy.url().should('contain', decisionLetterUrl);
      getFileUploadButton().attachFile(decisionLetter);
      getSaveAndContinueButton().click();
    } else if (
      change_link_question === 'Design and access statement submitted with application' &&
      change_answers[0].trim() === 'no'
    ) {
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', decisionLetterUrl);
      getFileUploadButton().attachFile(decisionLetter);
      getSaveAndContinueButton().click();
    } else if (
      change_link_question === 'Design and access statement' &&
      change_answers[0].trim() === 'yes'
    ) {
      getFileUploadButton().attachFile(change_answers[1].trim());
      getSaveAndContinueButton().click();
      cy.url().should('contain', decisionLetterUrl);
      getFileUploadButton().attachFile(decisionLetter);
      getSaveAndContinueButton().click();
    }
  },
);

When('appellant provides the {string} for {string} for your appeal section', (change_answer, change_link_question) => {
  const appeal_change_answers = change_answer.split(',');
  switch (change_link_question) {
    case 'Appeal statement':
      getFileUploadButton().attachFile(appeal_change_answers[0].trim());
      getSaveAndContinueButton().click();
      cy.url().should('contain', plansDrawingsUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', supportingDocumentsUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Plans and drawings':
      cy.url().should('contain', newPlansAndDrawingsUrl);
      getFileUploadButton().attachFile(appeal_change_answers[1].trim());
      getSaveAndContinueButton().click();
      cy.url().should('contain', supportingDocumentsUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Supporting documents':
      cy.url().should('contain', newSupportingDocumentsUrl);
      getFileUploadButton().attachFile(appeal_change_answers[1].trim());
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
  }
  if (change_link_question === 'Any plans or drawings to support your appeal' && appeal_change_answers[0].trim() === 'yes') {
    cy.url().should('contain', plansDrawingsUrl);
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', newPlansAndDrawingsUrl);
    getFileUploadButton().attachFile(plansAndDrawings);
    getSaveAndContinueButton().click();
    cy.url().should('contain', supportingDocumentsUrl);
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', taskListUrl);
  } else if (change_link_question === 'Any plans or drawings to support your appeal' && appeal_change_answers[0].trim() === 'no') {
    cy.url().should('contain', plansDrawingsUrl);
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', supportingDocumentsUrl);
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', taskListUrl);
  } else if (change_link_question === 'Any documents to support your appeal' && appeal_change_answers[0].trim() === 'yes') {
    cy.url().should('contain', supportingDocumentsUrl);
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', newSupportingDocumentsUrl);
    getFileUploadButton().attachFile(supportingDocument);
    getSaveAndContinueButton().click();
    cy.url().should('contain', taskListUrl);
  } else if (change_link_question === 'Any documents to support your appeal' && appeal_change_answers[0].trim() === 'no') {
    cy.url().should('contain', supportingDocumentsUrl);
    selectNo().click();
    getSaveAndContinueButton().click();
  }
});

When('appellant provides the {string} for {string} for appeal site section', (change_answer, change_link_question) => {
  const appeal_site_change_answers = change_answer.split(':');
  switch (change_link_question) {
    case 'Appeal site address':
      provideAddressLine1(appeal_site_change_answers[0].trim());
      provideAddressLine2(appeal_site_change_answers[1].trim());
      provideTownOrCity(appeal_site_change_answers[2].trim());
      provideCounty(appeal_site_change_answers[3].trim());
      providePostcode(appeal_site_change_answers[4].trim());
      getSaveAndContinueButton().click();
      cy.url().should('contain', ownAllOfLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', agriculturalLandHoldingUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Visible from a public road':
      if (appeal_site_change_answers[0] === 'no') {
        selectNo().click();
        notVisibleFromLandProvideDetails().clear().type(visibleFromRoadText);
        getSaveAndContinueButton().click();
        cy.url().should('contain', healthAndSafetyUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', taskListUrl);
      } else if (appeal_site_change_answers[0] === 'yes') {
        selectYes().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', healthAndSafetyUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', taskListUrl);
      }
      break;
    case 'Health and safety issues':
      if (appeal_site_change_answers[0] === 'yes') {
        selectYes().click();
        healthAndSafetyIssuesProvideDetails().clear().type(healthAndSafetyConcern);
        getSaveAndContinueButton().click();
        cy.url().should('contain', taskListUrl);
      } else if (appeal_site_change_answers[0] === 'no') {
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', taskListUrl);
      }
      break;
    case 'Is the appeal site part of an agricultural holding?':
      if (appeal_site_change_answers[0] === 'no') {
        selectNo().click();
      } else if (appeal_site_change_answers[0].trim() === 'yes') {
        selectYes().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', areYouTenantUrl);
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', tellingTheTenantsUrl);
        tellingTheTenantsToldAboutAppeal().check();
        tellingTheTenantsWithinLast21Days().check();
        tellingTheTenantsCopyOfTheForm().check();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Are you a tenant of the agricultural holding?':
      if (appeal_site_change_answers[0].trim() === 'no') {
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', tellingTheTenantsUrl);
        tellingTheTenantsToldAboutAppeal().check();
        tellingTheTenantsWithinLast21Days().check();
        tellingTheTenantsCopyOfTheForm().check();

      } else if (appeal_site_change_answers[0].trim() === 'yes') {
        selectYes().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', otherTenantsUrl);
        selectNo().click();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Are there any other tenants?':
      if (appeal_site_change_answers[0] === 'no') {
        selectNo().click();
      } else if (appeal_site_change_answers[0] === 'yes') {
        selectYes().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', tellingTheTenantsUrl);
        tellingTheTenantsToldAboutAppeal().check();
        tellingTheTenantsWithinLast21Days().check();
        tellingTheTenantsCopyOfTheForm().check();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Do you own the land involved in the appeal?':
      if (appeal_site_change_answers[0] === 'no') {
        selectNo().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain', ownSomeOfLandUrl);
        if (appeal_site_change_answers[1].trim() === 'yes') {
          selectYes().click();
          getSaveAndContinueButton().click();
          cy.url().should('contain', knowTheOwnersUrl);
          selectTheOwners(appeal_site_change_answers[2].trim());
          if (appeal_site_change_answers[2].trim() === 'Yes, I know who owns all the land') {
            cy.url().should('contain', tellingTheLandownersUrl);
            tellingTheLandOwnersToldAboutAppeal().check();
            tellingTheLandOwnersWithinLast21Days().check();
            tellingTheLandOwnersUseCopyOfTheForm().check();
          } else if (appeal_site_change_answers[2].trim() === 'I know who owns some of the land') {
            cy.url().should('contain', identifyingTheOwnersUrl)
            checkBoxIdentifyingTheOwners().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', advertisingTheAppealUrl);
            advertisingYourAppealToldAboutAppeal().check();
            advertisingYourAppealWithinLast21Days().check();
            advertisingYourAppealUseCopyOfTheForm().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', tellingTheLandownersUrl);
            tellingTheLandOwnersToldAboutAppeal().check();
            tellingTheLandOwnersWithinLast21Days().check();
            tellingTheLandOwnersUseCopyOfTheForm().check();
          } else if (appeal_site_change_answers[2].trim() === 'No, I do not know who owns any of the land') {
            cy.url().should('contain', identifyingTheOwnersUrl)
            checkBoxIdentifyingTheOwners().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', advertisingTheAppealUrl);
            advertisingYourAppealToldAboutAppeal().check();
            advertisingYourAppealWithinLast21Days().check();
            advertisingYourAppealUseCopyOfTheForm().check();
          }

        } else if (appeal_site_change_answers[1].trim() === 'no') {
          selectNo().click();
          getSaveAndContinueButton().click();
          cy.url().should('contain', knowTheOwnersUrl)
          selectTheOwners(appeal_site_change_answers[2].trim());
          if (appeal_site_change_answers[2].trim() === 'No, I do not know who owns any of the land') {
            cy.url().should('contain', identifyingTheOwnersUrl)
            checkBoxIdentifyingTheOwners().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', advertisingTheAppealUrl);
            advertisingYourAppealToldAboutAppeal().check();
            advertisingYourAppealWithinLast21Days().check();
            advertisingYourAppealUseCopyOfTheForm().check();
          } else if (appeal_site_change_answers[2].trim() === 'I know who owns some of the land') {
            cy.url().should('contain', identifyingTheOwnersUrl)
            checkBoxIdentifyingTheOwners().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', advertisingTheAppealUrl);
            advertisingYourAppealToldAboutAppeal().check();
            advertisingYourAppealWithinLast21Days().check();
            advertisingYourAppealUseCopyOfTheForm().check();
            getSaveAndContinueButton().click();
            cy.url().should('contain', tellingTheLandownersUrl);
            tellingTheLandOwnersToldAboutAppeal().check();
            tellingTheLandOwnersWithinLast21Days().check();
            tellingTheLandOwnersUseCopyOfTheForm().check();
          } else if (appeal_site_change_answers[2].trim() === 'Yes, I know who owns all the land') {
            cy.url().should('contain', tellingTheLandownersUrl);
            tellingTheLandOwnersToldAboutAppeal().check();
            tellingTheLandOwnersWithinLast21Days().check();
            tellingTheLandOwnersUseCopyOfTheForm().check();
          }
        }

      } else if (appeal_site_change_answers[0].trim() === 'yes') {
        selectYes().click();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', agriculturalLandHoldingUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Do you know who owns the rest of the land involved in the appeal?':
      cy.url().should('contain', knowTheOwnersUrl);
      selectTheOwners(appeal_site_change_answers[0].trim());
      if (appeal_site_change_answers[0].trim() === 'Yes, I know who owns all the land') {
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      } else if (appeal_site_change_answers[0].trim() === 'I know who owns some of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      } else if (appeal_site_change_answers[0].trim() === 'No, I do not know who owns any of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', agriculturalLandHoldingUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
    case 'Do you know who owns the land involved in the appeal?':
      cy.url().should('contain', knowTheOwnersUrl);
      selectTheOwners(appeal_site_change_answers[0].trim());
      if (appeal_site_change_answers[0].trim() === 'Yes, I know who owns all the land') {
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      } else if (appeal_site_change_answers[0].trim() === 'I know who owns some of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      } else if (appeal_site_change_answers[0].trim() === 'No, I do not know who owns any of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
      }
      getSaveAndContinueButton().click();
      cy.url().should('contain', agriculturalLandHoldingUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', visibleFromPublicLandUrl);
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', healthAndSafetyUrl);
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', taskListUrl);
      break;
  }
});

Then('appellant is displayed answers for {string} for {string} for appeal site section', (change_link_question, change_answer) => {
  const appeal_site_change_answers = change_answer.split(':');
  verifyFullAppealCYAQuestion(getAppealSiteAddressQuestion, 'Appeal site address');
  verifyFullAppealCYAChangLink(getAppealSiteAddressChangeLink, '/full-appeal/submit-appeal/appeal-site-address');
  switch (change_link_question) {
    case 'Appeal site address':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, appeal_site_change_answers[0].trim());
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, appeal_site_change_answers[1].trim());
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, appeal_site_change_answers[2].trim());
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, appeal_site_change_answers[3].trim());
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, appeal_site_change_answers[4].trim());
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
      break;
    case 'Visible from a public road':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      if (appeal_site_change_answers[0] === 'no') {
        verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'No');
        verifyFullAppealCYAAnswer(getVisibleFromPublicRoadDetails, visibleFromRoadText);
      } else if (appeal_site_change_answers === 'yes') {
        verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      }
      break;
    case 'Health and safety issues':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      if (appeal_site_change_answers[0] === 'yes') {
        verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'Yes');
        verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesDetails, healthAndSafetyConcern);
      } else if (appeal_site_change_answers[0] === 'no') {
        verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
      }
      break;
    case 'Is the appeal site part of an agricultural holding?':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      if (appeal_site_change_answers[0] === 'no') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
      } else if (appeal_site_change_answers[0].trim() === 'yes') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'Yes');
        verifyFullAppealCYAQuestion(getAgriculturalHoldingTenantQuestion, 'Are you a tenant of the agricultural holding?');
        verifyFullAppealCYAChangLink(getAgriculturalHoldingTenantChangeLink, '/full-appeal/submit-appeal/are-you-a-tenant');
        verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer, 'No');
        verifyFullAppealCYAQuestion(getTellingTheOtherTenantsQuestion, 'Telling the tenants');
        verifyFullAppealCYAChangLink(getTellingTheOtherTenantsChangeLink, '/full-appeal/submit-appeal/telling-the-tenants');
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerAllOtherTenants, "I've told all the tenants about my appeal");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerCopyOfForm, 'I used a copy of the form in annexe 2a');
      }
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
      break;
    case 'Are you a tenant of the agricultural holding?':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingTenantQuestion, 'Are you a tenant of the agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingTenantChangeLink, '/full-appeal/submit-appeal/are-you-a-tenant');
      if (appeal_site_change_answers[0].trim() === 'no') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer, 'No');
        verifyFullAppealCYAQuestion(getTellingTheOtherTenantsQuestion, 'Telling the tenants');
        verifyFullAppealCYAChangLink(getTellingTheOtherTenantsChangeLink, '/full-appeal/submit-appeal/telling-the-tenants');
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerAllOtherTenants, "I've told all the tenants about my appeal");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerCopyOfForm, 'I used a copy of the form in annexe 2a');
      } else if (appeal_site_change_answers[0].trim() === 'yes') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer, 'Yes');
        verifyFullAppealCYAQuestion(getAgriculturalHoldingOtherTenantQuestion, 'Are there any other tenants?');
        verifyFullAppealCYAChangLink(getAgriculturalHoldingOtherTenantChangeLink, '/full-appeal/submit-appeal/other-tenants');
        verifyFullAppealCYAAnswer(getAgriculturalHoldingOtherTenantAnswer, 'No');
      }
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
      break;
    case 'Are there any other tenants?':
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingTenantQuestion, 'Are you a tenant of the agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingTenantChangeLink, '/full-appeal/submit-appeal/are-you-a-tenant');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getAgriculturalHoldingOtherTenantQuestion, 'Are there any other tenants?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingOtherTenantChangeLink, '/full-appeal/submit-appeal/other-tenants');
      if (appeal_site_change_answers[0] === 'no') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingOtherTenantAnswer, 'No');
      } else if (appeal_site_change_answers[0] === 'yes') {
        verifyFullAppealCYAAnswer(getAgriculturalHoldingOtherTenantAnswer, 'Yes');
        verifyFullAppealCYAQuestion(getTellingTheOtherTenantsQuestion, 'Telling the other tenants');
        verifyFullAppealCYAChangLink(getTellingTheOtherTenantsChangeLink, '/full-appeal/submit-appeal/telling-the-tenants');
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerAllOtherTenants, "I've told all the other tenants about my appeal");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerCopyOfForm, 'I used a copy of the form in annexe 2a');
      }
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
      break;
    case 'Do you own the land involved in the appeal?':
      verifyFullAppealCYAQuestion(getAppealSiteAddressQuestion, 'Appeal site address');
      verifyFullAppealCYAChangLink(getAppealSiteAddressChangeLink, '/full-appeal/submit-appeal/appeal-site-address');
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      if (appeal_site_change_answers[0] === 'no') {
        if (appeal_site_change_answers[1].trim() === 'yes') {
          verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own some of the land involved in the appeal');
          if (appeal_site_change_answers[2].trim() === 'Yes, I know who owns all the land') {
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'Yes, I know who owns all the land');
            verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the other landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the other landowners about my appeal");
            verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the rest of the land involved in the appeal?');
            verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
          } else if (appeal_site_change_answers[2].trim() === 'I know who owns some of the land') {
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'I know who owns some of the land');
            verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the other landowners');
            verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
            verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the other landowners, but have not been successful");
            verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
            verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the other landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the other landowners about my appeal");
            verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the rest of the land involved in the appeal?');
            verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
          } else if (appeal_site_change_answers[2].trim() === 'No, I do not know who owns any of the land') {
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'No, I do not know who owns any of the land');
            verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the other landowners');
            verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
            verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the other landowners, but have not been successful");
            verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
            verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
          }

        } else if (appeal_site_change_answers[1].trim() === 'no') {
          verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own none of the land involved in the appeal');
          if (appeal_site_change_answers[2].trim() === 'No, I do not know who owns any of the land') {
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'No, I do not know who owns any of the land');
            verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the landowners');
            verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
            verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the landowners, but have not been successful");
            verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
            verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
          } else if (appeal_site_change_answers[2].trim() === 'I know who owns some of the land') {
            verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the landowners about my appeal");
            verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the land involved in the appeal?');
            verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'I know who owns some of the land');
            verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the landowners');
            verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
            verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the landowners, but have not been successful");
            verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
            verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
          } else if (appeal_site_change_answers[2].trim() === 'Yes, I know who owns all the land') {
            verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'Yes, I know who owns all the land');
            verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the landowners about my appeal");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
            verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
            verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the land involved in the appeal?');
            verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
          }
        }

      } else if (appeal_site_change_answers[0] === 'yes') {
        verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
      }
      verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
      verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
      verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
      verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
      verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
      verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
      verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
      break;
    case 'Do you know who owns the rest of the land involved in the appeal?':
      verifyFullAppealCYAQuestion(getAppealSiteAddressQuestion, 'Appeal site address');
      verifyFullAppealCYAChangLink(getAppealSiteAddressChangeLink, '/full-appeal/submit-appeal/appeal-site-address');
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own some of the land involved in the appeal');
      if (appeal_site_change_answers[0].trim() === 'Yes, I know who owns all the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'Yes, I know who owns all the land');
        verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the other landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the other landowners about my appeal");
        verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the rest of the land involved in the appeal?');
        verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
      } else if (appeal_site_change_answers[0].trim() === 'I know who owns some of the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'I know who owns some of the land');
        verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the other landowners');
        verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
        verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the other landowners, but have not been successful");
        verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
        verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the other landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the other landowners about my appeal");
        verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the rest of the land involved in the appeal?');
        verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
      } else if (appeal_site_change_answers[0].trim() === 'No, I do not know who owns any of the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'No, I do not know who owns any of the land');
        verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the other landowners');
        verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
        verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the other landowners, but have not been successful");
        verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
        verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
      }
      break;
    case 'Do you know who owns the land involved in the appeal?':
      verifyFullAppealCYAQuestion(getAppealSiteAddressQuestion, 'Appeal site address');
      verifyFullAppealCYAChangLink(getAppealSiteAddressChangeLink, '/full-appeal/submit-appeal/appeal-site-address');
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
      verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
      verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
      verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own none of the land involved in the appeal');
      if (appeal_site_change_answers[0].trim() === 'Yes, I know who owns all the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'Yes, I know who owns all the land');
        verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the landowners about my appeal");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the land involved in the appeal?');
        verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
      } else if (appeal_site_change_answers[0].trim() === 'I know who owns some of the land') {
        verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the landowners about my appeal");
        verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the land involved in the appeal?');
        verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'I know who owns some of the land');
        verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the landowners');
        verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
        verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the landowners, but have not been successful");
        verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
        verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
      } else if (appeal_site_change_answers[0].trim() === 'No, I do not know who owns any of the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'No, I do not know who owns any of the land');
        verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the landowners');
        verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
        verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the landowners, but have not been successful");
        verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
        verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
      }
      break;
  }
});

Then('appellant is displayed answers for {string} for {string} for contact details section', (change_link_question, change_answer) => {
  let contact_details = change_answer.split(',');
  verifyFullAppealCYAQuestion(getPlanningAppMadeInYourNameQuestion, 'Was the planning application made in your name?');
  verifyFullAppealCYAChangLink(getPlanningAppMadeInYourNameChangeLink, '/full-appeal/submit-appeal/original-applicant');
  verifyFullAppealCYAQuestion(getPlanningAppContactDetailsQuestion, 'Your contact details');
  switch (contact_details[0]) {
    case 'appellant':
      verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, 'Yes, the planning application was made in my name');
      verifyFullAppealCYAChangLink(getPlanningAppContactDetailsChangeLink, '/full-appeal/submit-appeal/contact-details');
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, originalAppellantFullNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, originalAppellantCompanyNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, originalAppellantEmailText);
      break;
    case 'agent':
      verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, "No, I'm acting on behalf of the appellant");
      verifyFullAppealCYAQuestion(getPlanningAppMadeOnBehalfOfQuestion, 'Appeal made on behalf of');
      verifyFullAppealCYAChangLink(getPlanningAppMadeOnBehalfOfChangeLink, '/full-appeal/submit-appeal/applicant-name');
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfNameAnswer, applicantName);
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfCompanyAnswer, originalAppellantCompanyNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, agentFullNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, agentCompanyNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, agentEmailText);
      break;
    case 'appellant_new_contact':
      verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, 'Yes, the planning application was made in my name');
      verifyFullAppealCYAChangLink(getPlanningAppContactDetailsChangeLink, '/full-appeal/submit-appeal/contact-details');
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, contact_details[1].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, contact_details[2].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, contact_details[3].trim());
      break;
    case 'agent_new_contact':
      verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, "No, I'm acting on behalf of the appellant");
      verifyFullAppealCYAQuestion(getPlanningAppMadeOnBehalfOfQuestion, 'Appeal made on behalf of');
      verifyFullAppealCYAChangLink(getPlanningAppMadeOnBehalfOfChangeLink, '/full-appeal/submit-appeal/applicant-name');
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfNameAnswer, applicantName);
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfCompanyAnswer, originalAppellantCompanyNameText);
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, contact_details[1].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, contact_details[2].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, contact_details[3].trim());
      break;
    case 'agent_appeal_on_behalf_of':
      verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, "No, I'm acting on behalf of the appellant");
      verifyFullAppealCYAQuestion(getPlanningAppMadeOnBehalfOfQuestion, 'Appeal made on behalf of');
      verifyFullAppealCYAChangLink(getPlanningAppMadeOnBehalfOfChangeLink, '/full-appeal/submit-appeal/applicant-name');
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfNameAnswer, contact_details[1].trim());
      verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfCompanyAnswer, contact_details[2].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, contact_details[3].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, contact_details[4].trim());
      verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, contact_details[5].trim());
      break;
  }
});

Then('appellant is displayed answers for {string} for {string} for deciding your appeal section', (change_link_question, change_answer) => {
  const change_answers = change_answer.split(',');
  if (change_link_question === 'How would you prefer us to decide your appeal?') {
    verifyFullAppealCYAQuestion(getProcedureTypeQuestion, 'How would you prefer us to decide your appeal?');
    verifyFullAppealCYAChangLink(getProcedureTypeChangeLink, '/full-appeal/submit-appeal/how-decide-appeal');
    switch (change_answers[0]) {
      case 'Written representations':
        verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Written Representation');
        break;
      case 'Hearing':
        verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Hearing');
        verifyFullAppealCYAQuestion(getPreferAHearingQuestion, 'Why would you prefer a hearing?')
        verifyFullAppealCYAChangLink(getPreferAHearingChangeLink, '/full-appeal/submit-appeal/why-hearing');
        verifyFullAppealCYAAnswer(getPreferAHearingAnswer, textHearing);
        verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
        verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
        verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
        break;
      case 'Inquiry':
        verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Inquiry');
        verifyFullAppealCYAQuestion(getPreferAnInquiryQuestion, 'Why would you prefer an inquiry?');
        verifyFullAppealCYAChangLink(getPreferAnInquiryChangeLink, '/full-appeal/submit-appeal/why-inquiry');
        verifyFullAppealCYAAnswer(getPreferAnInquiryAnswer, textInquiry);
        verifyFullAppealCYAQuestion(getNumberOfDaysForInquiryQuestion, 'How many days would you expect the inquiry to last?');
        verifyFullAppealCYAChangLink(getNumberOfDaysForInquiryChangeLink, '/full-appeal/submit-appeal/expect-inquiry-last');
        verifyFullAppealCYAAnswer(getNumberOfDaysForInquiryAnswer, validNumberDays);
        verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
        verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
        verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
        break;
    }
  } else if (change_link_question === 'Why would you prefer a hearing?') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Hearing');
    verifyFullAppealCYAQuestion(getPreferAHearingQuestion, 'Why would you prefer a hearing?')
    verifyFullAppealCYAChangLink(getPreferAHearingChangeLink, '/full-appeal/submit-appeal/why-hearing');
    verifyFullAppealCYAAnswer(getPreferAHearingAnswer, change_answers[0]);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
  } else if (change_link_question === 'Draft statement of common ground' && change_answers[1] === 'Hearing') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Hearing');
    verifyFullAppealCYAQuestion(getPreferAHearingQuestion, 'Why would you prefer a hearing?')
    verifyFullAppealCYAChangLink(getPreferAHearingChangeLink, '/full-appeal/submit-appeal/why-hearing');
    verifyFullAppealCYAAnswer(getPreferAHearingAnswer, textHearing);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, change_answer);
  } else if (change_link_question === 'Why would you prefer an inquiry?') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Inquiry');
    verifyFullAppealCYAQuestion(getPreferAnInquiryQuestion, 'Why would you prefer an inquiry?');
    verifyFullAppealCYAChangLink(getPreferAnInquiryChangeLink, '/full-appeal/submit-appeal/why-inquiry');
    verifyFullAppealCYAAnswer(getPreferAnInquiryAnswer, change_answers[0]);
    verifyFullAppealCYAQuestion(getNumberOfDaysForInquiryQuestion, 'How many days would you expect the inquiry to last?');
    verifyFullAppealCYAChangLink(getNumberOfDaysForInquiryChangeLink, '/full-appeal/submit-appeal/expect-inquiry-last');
    verifyFullAppealCYAAnswer(getNumberOfDaysForInquiryAnswer, validNumberDays);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
  } else if (change_link_question === 'How many days would you expect the inquiry to last?') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Inquiry');
    verifyFullAppealCYAQuestion(getPreferAnInquiryQuestion, 'Why would you prefer an inquiry?');
    verifyFullAppealCYAChangLink(getPreferAnInquiryChangeLink, '/full-appeal/submit-appeal/why-inquiry');
    verifyFullAppealCYAAnswer(getPreferAnInquiryAnswer, textInquiry);
    verifyFullAppealCYAQuestion(getNumberOfDaysForInquiryQuestion, 'How many days would you expect the inquiry to last?');
    verifyFullAppealCYAChangLink(getNumberOfDaysForInquiryChangeLink, '/full-appeal/submit-appeal/expect-inquiry-last');
    verifyFullAppealCYAAnswer(getNumberOfDaysForInquiryAnswer, change_answers[0]);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
  } else if (change_link_question === 'Draft statement of common ground' && change_answers[1] === 'Inquiry') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Inquiry');
    verifyFullAppealCYAQuestion(getPreferAnInquiryQuestion, 'Why would you prefer an inquiry?');
    verifyFullAppealCYAChangLink(getPreferAnInquiryChangeLink, '/full-appeal/submit-appeal/why-inquiry');
    verifyFullAppealCYAAnswer(getPreferAnInquiryAnswer, textInquiry);
    verifyFullAppealCYAQuestion(getNumberOfDaysForInquiryQuestion, 'How many days would you expect the inquiry to last?');
    verifyFullAppealCYAChangLink(getNumberOfDaysForInquiryChangeLink, '/full-appeal/submit-appeal/expect-inquiry-last');
    verifyFullAppealCYAAnswer(getNumberOfDaysForInquiryAnswer, validNumberDays);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, change_answers[0]);
  }
})

Then('appellant is displayed answers for {string} for {string} for planning application section', (change_link_question, change_answer) => {
  const change_answers = change_answer.split(',');
  verifyFullAppealCYAQuestion(getPlanningApplicationNumberQuestion, 'Planning application number');
  verifyFullAppealCYAChangLink(getPlanningApplicationNumberChangeLink, '/full-appeal/submit-appeal/application-number');
  verifyFullAppealCYAQuestion(getPlanningApplicationFormQuestion, 'Planning application form');
  verifyFullAppealCYAChangLink(getPlanningApplicationFormChangeLink, '/full-appeal/submit-appeal/application-form');
  verifyFullAppealCYAQuestion(getDesignAccessStatementSubmittedQuestion, 'Design and access statement submitted with application');
  verifyFullAppealCYAChangLink(getDesignAccessStatementSubmittedChangeLink, '/full-appeal/submit-appeal/design-access-statement-submitted');
  verifyFullAppealCYAQuestion(getPlansDrawingSupportingDocumentsQuestion, 'Plans, drawings and supporting documents');
  verifyFullAppealCYAChangLink(getPlansDrawingSupportingDocumentsChangeLink, '/full-appeal/submit-appeal/plans-drawings-documents');
  verifyFullAppealCYAQuestion(getDecisionLetterQuestion, 'Decision letter');
  verifyFullAppealCYAChangLink(getDecisionLetterChangeLink, '/full-appeal/submit-appeal/decision-letter');
  switch (change_link_question) {
    case 'Planning application form':
      verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer, planningAppNumberText);
      verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer, change_answers[0].trim());
      verifyFullAppealCYAAnswer(getPlansDrawingSupportingDocumentsAnswer, plansAndDrawingsDocument);
      verifyFullAppealCYAAnswer(getDecisionLetterAnswer, decisionLetter);
      verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
      break;
    case 'Planning application number':
      verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer, change_answers[0].trim());
      verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer, planningAppFormDocument);
      verifyFullAppealCYAAnswer(getPlansDrawingSupportingDocumentsAnswer, plansAndDrawingsDocument);
      verifyFullAppealCYAAnswer(getDecisionLetterAnswer, decisionLetter);
      verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
      break;
    case 'Plans, drawings and supporting documents':
      verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer, planningAppNumberText);
      verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer, planningAppFormDocument);
      verifyFullAppealCYAAnswer(getPlansDrawingSupportingDocumentsAnswer, change_answers[0].trim());
      verifyFullAppealCYAAnswer(getDecisionLetterAnswer, decisionLetter);
      verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
      break;
    case 'Decision letter':
      verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer, planningAppNumberText);
      verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer, planningAppFormDocument);
      verifyFullAppealCYAAnswer(getPlansDrawingSupportingDocumentsAnswer, plansAndDrawingsDocument);
      verifyFullAppealCYAAnswer(getDecisionLetterAnswer, change_answers[0].trim());
      verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
      break;
  }
  if (change_link_question === 'Design and access statement submitted with application' && change_answers[0].trim() === 'yes') {
    verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getDesignAccessStatementQuestion, 'Design and access statement');
    verifyFullAppealCYAChangLink(getDesignAccessStatementChangeLink, '/full-appeal/submit-appeal/design-access-statement');
    verifyFullAppealCYAAnswer(getDesignAccessStatementAnswer, designAccessStatementDocument);
  } else if (change_link_question === 'Design and access statement submitted with application' && change_answers[0].trim() === 'no') {
    verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
  } else if (change_link_question === 'Design and access statement' && change_answers[0].trim() === 'yes') {
    verifyFullAppealCYAQuestion(getDesignAccessStatementQuestion, 'Design and access statement');
    verifyFullAppealCYAChangLink(getDesignAccessStatementChangeLink, '/full-appeal/submit-appeal/design-access-statement');
    verifyFullAppealCYAAnswer(getDesignAccessStatementAnswer, change_answers[1].trim());
  }
});

Then('appellant is displayed answers for {string} for {string} for your appeal section', (change_link_question, change_answer) => {
  const appeal_change_answers = change_answer.split(',');
  verifyFullAppealCYAQuestion(getAppealStatementQuestion, 'Appeal statement');
  verifyFullAppealCYAChangLink(getAppealStatementChangeLink, '/full-appeal/submit-appeal/appeal-statement');
  verifyFullAppealCYAQuestion(getPlansOrDrawingSupportingQuestion, 'Any plans or drawings to support your appeal');
  verifyFullAppealCYAChangLink(getPlansOrDrawingSupportingChangeLink, '/full-appeal/submit-appeal/plans-drawings');
  verifyFullAppealCYAQuestion(getDocumentsToSupportAppealQuestion, 'Any documents to support your appeal');
  verifyFullAppealCYAChangLink(getDocumentsToSupportAppealChangeLink, '/full-appeal/submit-appeal/supporting-documents');
  switch (change_link_question) {
    case 'Appeal statement':
      verifyFullAppealCYAAnswer(getAppealStatementAnswer, appeal_change_answers[0].trim());
      break;
    case 'Plans and drawings':
      verifyFullAppealCYAAnswer(getAppealStatementAnswer, appealStatement);
      verifyFullAppealCYAAnswer(getPlansOrDrawingSupportingAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getPlansOrDrawingQuestion, 'Plans and drawings');
      verifyFullAppealCYAChangLink(getPlansOrDrawingChangeLink, '/full-appeal/submit-appeal/new-plans-drawings');
      verifyFullAppealCYAAnswer(getPlansOrDrawingAnswer, appeal_change_answers[1].trim());
      break;
    case 'Supporting documents':
      verifyFullAppealCYAAnswer(getAppealStatementAnswer, appealStatement);
      verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'Yes');
      verifyFullAppealCYAQuestion(getSupportingDocumentsAppealQuestion, 'Supporting documents');
      verifyFullAppealCYAChangLink(getSupportingDocumentsAppealChangeLink, '/full-appeal/submit-appeal/new-supporting-documents');
      verifyFullAppealCYAAnswer(getSupportingDocumentsAppealAnswer, appeal_change_answers[1].trim());
  }
  if (change_link_question === 'Any plans or drawings to support your appeal' && appeal_change_answers[0].trim() === 'yes') {
    verifyFullAppealCYAAnswer(getPlansOrDrawingSupportingAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getPlansOrDrawingQuestion, 'Plans and drawings');
    verifyFullAppealCYAChangLink(getPlansOrDrawingChangeLink, '/full-appeal/submit-appeal/new-plans-drawings');
    verifyFullAppealCYAAnswer(getPlansOrDrawingAnswer, plansAndDrawings);
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'No');
  } else if (change_link_question === 'Any plans or drawings to support your appeal' && appeal_change_answers[0].trim() === 'no') {
    verifyFullAppealCYAAnswer(getPlansOrDrawingSupportingAnswer, 'No');
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'No');
  } else if (change_link_question === 'Any documents to support your appeal' && appeal_change_answers[0].trim() === 'yes') {
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getSupportingDocumentsAppealQuestion, 'Supporting documents');
    verifyFullAppealCYAChangLink(getSupportingDocumentsAppealChangeLink, '/full-appeal/submit-appeal/new-supporting-documents');
    verifyFullAppealCYAAnswer(getSupportingDocumentsAppealAnswer, supportingDocument);
  } else if (change_link_question === 'Any documents to support your appeal' && appeal_change_answers[0].trim() === 'no') {
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'No');
  }
});
