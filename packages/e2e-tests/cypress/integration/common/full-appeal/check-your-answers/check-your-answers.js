import {Given, Then, When} from 'cypress-cucumber-preprocessor/steps';
import {
  linkDecideYourAppeal,
  linkProvideYourContactDetails,
  linkTellAboutTheAppealSite, linkUploadDocsForYourAppeal,
  linkUploadDocsFromPlanningApplication, pageCaptionText,
  statusAppealDecisionSection,
  statusProvideYourContactDetails, statusTellAboutTheAppealSite, statusUploadDocsFromPlanningApplication,
} from '../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  applicantCompanyName,
  contactDetailsCompanyName, contactDetailsEmail,
  contactDetailsFullName, originalApplicantName, originalApplicantNo,
  originalApplicantYes,
} from '../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { getFileUploadButton, getSaveAndContinueButton } from '../../../../support/common-page-objects/common-po';
import { provideAddressLine1 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2';
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
  tellingTheTenantsWithinLast21Days,
} from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { selectTheOwners } from '../../../../support/full-appeal/appeals-service/selectTheOwners';
import { provideTownOrCity } from '../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../support/common/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import {
  selectHearing, selectInquiry,
  selectWrittenRepresentations,
  textBoxExpectDays,
  textBoxInquiry, textBoxWhyHearing,
} from '../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import { planningApplicationNumber } from '../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po';
import {
  CheckYourAnswersLink,
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
  getAppealSiteSectionHeading,
  getAppealStatementAnswer,
  getAppealStatementChangeLink,
  getAppealStatementQuestion,
  getContactDetailsSectionHeading,
  getDecidingYourAppealSectionHeading,
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
  getHealthAndSafetyIssuesChangeLink, getHealthAndSafetyIssuesDetails,
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
  getPreferAHearingAnswer, getPreferAHearingChangeLink,
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
  getYourAppealSectionHeading,
  getYourPlanningApplicationSectionHeading,
} from '../../../../support/full-appeal/appeals-service/page-objects/check-your-answers-po';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyFullAppealCYAQuestion } from '../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAQuestion';
import { verifyFullAppealCYAChangLink } from '../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAChangLink';
import { verifyFullAppealCYAAnswer } from '../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAAnswer';
import { notVisibleFromLandProvideDetails } from '../../../../support/full-appeal/appeals-service/page-objects/visible-from-road-po';
import { healthAndSafetyIssuesProvideDetails } from '../../../../support/full-appeal/appeals-service/page-objects/health-safety-issues-po';
import { checkboxConfirmSensitiveInfo } from '../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';

const url = 'full-appeal/submit-appeal/check-your-answers';
const pageTitle = 'Check your answers - Appeal a planning decision - GOV.UK';
const pageHeading = 'Check your answers';
const checkYourAnswerCaptionText = 'Check your answers and submit your appeal';
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
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const agriculturalLandHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const visibleFromPublicLandUrl = 'full-appeal/submit-appeal/visible-from-road';
const healthAndSafetyUrl = 'full-appeal/submit-appeal/health-safety-issues';
const decideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const whyHearingUrl = 'full-appeal/submit-appeal/why-hearing';
const textHearing = 'I want to provide the facts of the Appeal for the formal decision';
const daysToExpectTheInquiryUrl = 'full-appeal/submit-appeal/expect-inquiry-last';
const planningAppFormUrl = 'full-appeal/submit-appeal/application-form';
const planningAppNumberUrl = 'full-appeal/submit-appeal/application-number';
const advertisingTheAppealUrl = '/full-appeal/submit-appeal/advertising-your-appeal';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const designAccessStatementSubmittedUrl = 'full-appeal/submit-appeal/design-access-statement-submitted';
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


Given('the appellant has provided details for {string} and status is {string}', (contact_Details, progress) => {
  cy.url().should('contain', taskListUrl);
  linkProvideYourContactDetails().click();
  if (contact_Details === 'appellant') {
    originalApplicantYes().click();
    getSaveAndContinueButton().click();
    contactDetailsFullName().clear().type(originalAppellantFullNameText);
    contactDetailsCompanyName().clear().type(originalAppellantCompanyNameText);
    contactDetailsEmail().clear().type(originalAppellantEmailText);
    getSaveAndContinueButton().click();
  } else if (contact_Details === 'agent') {
    originalApplicantNo().click();
    getSaveAndContinueButton().click();
    originalApplicantName().clear().type(applicantName);
    applicantCompanyName().clear().type(originalAppellantCompanyNameText);
    getSaveAndContinueButton().click();
    contactDetailsFullName().clear().type(agentFullNameText);
    contactDetailsCompanyName().clear().type(agentCompanyNameText);
    contactDetailsEmail().clear().type(agentEmailText);
    getSaveAndContinueButton().click();
  }
  cy.url().should('contain', taskListUrl);
  statusProvideYourContactDetails().should('contain.text', progress);
});

Given('appellant provides the details for {string}, {string}, {string}, {string}, {string}, {string}, {string} and {string} and status is {string}', (own_land, own_some_land, knowTheOwners, agricultural_holding, visible_publicLand, tenant, other_tenants, health_and_safety, progress) => {
  linkTellAboutTheAppealSite().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  provideAddressLine2(addressLine2);
  provideTownOrCity(townCity);
  provideCounty(county);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  if (own_land === 'yes') {
    selectYes().click();
  } else if (own_land === 'no') {
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', ownSomeOfLandUrl);
    if (own_some_land === 'yes') {
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', knowTheOwnersUrl)
      selectTheOwners(knowTheOwners);
      if (knowTheOwners === 'No, I do not know who owns any of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
    }
      else if(knowTheOwners === 'I know who owns some of the land'){
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
      }else{
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      }
    }
    else if(own_some_land=== 'no'){
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain', knowTheOwnersUrl)
      selectTheOwners(knowTheOwners);
      if (knowTheOwners === 'No, I do not know who owns any of the land') {
        cy.url().should('contain', identifyingTheOwnersUrl)
        checkBoxIdentifyingTheOwners().check();
        getSaveAndContinueButton().click();
        cy.url().should('contain', advertisingTheAppealUrl);
        advertisingYourAppealToldAboutAppeal().check();
        advertisingYourAppealWithinLast21Days().check();
        advertisingYourAppealUseCopyOfTheForm().check();
    }
      else if(knowTheOwners === 'I know who owns some of the land'){
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
      }
      else{
        cy.url().should('contain', tellingTheLandownersUrl);
        tellingTheLandOwnersToldAboutAppeal().check();
        tellingTheLandOwnersWithinLast21Days().check();
        tellingTheLandOwnersUseCopyOfTheForm().check();
      }
    }
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalLandHoldingUrl);
  if (agricultural_holding === 'no') {
    selectNo().click();
  } else if (agricultural_holding === 'yes') {
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain',areYouTenantUrl);
    if(tenant === 'yes'){
      selectYes().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',otherTenantsUrl);
      if(other_tenants==='yes'){
        selectYes().click();
        getSaveAndContinueButton().click();
        cy.url().should('contain',tellingTheTenantsUrl);
        tellingTheTenantsToldAboutAppeal().check();
        tellingTheTenantsWithinLast21Days().check();
        tellingTheTenantsCopyOfTheForm().check();
      }
      else if(other_tenants==='no'){
        selectNo().click();
      }
    }
    else if(tenant==='no'){
      selectNo().click();
      getSaveAndContinueButton().click();
      cy.url().should('contain',tellingTheTenantsUrl);
      tellingTheTenantsToldAboutAppeal().check();
      tellingTheTenantsWithinLast21Days().check();
      tellingTheTenantsCopyOfTheForm().check();
    }
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', visibleFromPublicLandUrl);
  if (visible_publicLand === 'yes') {
    selectYes().click();
  }else if(visible_publicLand === 'no'){
    selectNo().click();
    notVisibleFromLandProvideDetails().type(`{selectall}{backspace}${visibleFromRoadText}`);
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', healthAndSafetyUrl);
  if (health_and_safety === 'no') {
    selectNo().click();
  }else if(health_and_safety === 'yes'){
    selectYes().click();
    healthAndSafetyIssuesProvideDetails().type(`{selectall}{backspace}${healthAndSafetyConcern}`);
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  statusTellAboutTheAppealSite().should('contain.text', progress)
});

Given('appellant provides the details about {string} preference and status is {string}', (appeal_decision, progress) => {
  linkDecideYourAppeal().click();
  cy.url().should('contain', decideAppealUrl);
  if (appeal_decision === 'Written representations') {
    selectWrittenRepresentations().click();
    getSaveAndContinueButton().click();
  } else if (appeal_decision === 'Hearing') {
    selectHearing().click();
    getSaveAndContinueButton().click();
    cy.url().should('include', whyHearingUrl);
    textBoxWhyHearing().clear().type(textHearing);
    getSaveAndContinueButton().click();
    cy.url().should('include', draftStatementUrl);
    getFileUploadButton().attachFile(draftStatementDocument);
    getSaveAndContinueButton().click();
  } else if (appeal_decision === 'Inquiry') {
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
  }
  cy.url().should('contain', taskListUrl);
  statusAppealDecisionSection().should('contain.text', progress);
});

Given('appellant uploads documents from planning application and design and access statement as {string} and status is {string}', (design_access_statement, progress) => {
  linkUploadDocsFromPlanningApplication().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile(planningAppFormDocument);
  getSaveAndContinueButton().click();
  cy.url().should('contain', planningAppNumberUrl);
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansAndDrawingsDocumentsUrl);
  getFileUploadButton().attachFile(plansAndDrawingsDocument);
  getSaveAndContinueButton().click();
  cy.url().should('contain', designAccessStatementSubmittedUrl);
  if (design_access_statement === 'no') {
    selectNo().click();
  } else if (design_access_statement === 'yes') {
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', designAccessStatementUrl);
    getFileUploadButton().attachFile(designAccessStatementDocument);
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', decisionLetterUrl);
  getFileUploadButton().attachFile(decisionLetter);
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  statusUploadDocsFromPlanningApplication().should('contain.text', progress);
});

Given('appellant uploads documents for appeal for plans and drawings {string} and supporting documents {string} and status is {string}', (plans_and_drawings, supporting_documents, progress) => {
  linkUploadDocsForYourAppeal().click();
  getFileUploadButton().attachFile(appealStatement);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansDrawingsUrl);
  if (plans_and_drawings === 'no') {
    selectNo().click();
  } else if (plans_and_drawings === 'yes') {
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', newPlansAndDrawingsUrl);
    getFileUploadButton().attachFile(plansAndDrawings);
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', supportingDocumentsUrl);
  if (supporting_documents === 'no') {
    selectNo().click();
  } else if (supporting_documents === 'yes') {
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', newSupportingDocumentsUrl);
    getFileUploadButton().attachFile(supportingDocument);
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
  statusUploadDocsFromPlanningApplication().should('contain.text', progress);
});

When('appellant clicks on Check your answers link', () => {
  CheckYourAnswersLink().click();
});

Then('appellant is displayed the check your answer page', () => {
  cy.url().should('contain', url);
  pageCaptionText(checkYourAnswerCaptionText);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  getContactDetailsSectionHeading().should('be.visible');
  getAppealSiteSectionHeading().should('be.visible');
  getDecidingYourAppealSectionHeading().should('be.visible');
  getYourPlanningApplicationSectionHeading().should('be.visible');
  getYourAppealSectionHeading().should('be.visible');
  cy.checkPageA11y();
});

Then('appellant is displayed answers for {string}', (contact_details) => {
  verifyFullAppealCYAQuestion(getPlanningAppMadeInYourNameQuestion, 'Was the planning application made in your name?');
  verifyFullAppealCYAChangLink(getPlanningAppMadeInYourNameChangeLink, '/full-appeal/submit-appeal/original-applicant');
  verifyFullAppealCYAQuestion(getPlanningAppContactDetailsQuestion, 'Your contact details');
  if (contact_details === 'appellant') {
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, 'Yes, the planning application was made in my name');
    verifyFullAppealCYAChangLink(getPlanningAppContactDetailsChangeLink, '/full-appeal/submit-appeal/contact-details');
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, originalAppellantFullNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, originalAppellantCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, originalAppellantEmailText);
  } else if (contact_details === 'agent') {
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, "No, I'm acting on behalf of the appellant");
    verifyFullAppealCYAQuestion(getPlanningAppMadeOnBehalfOfQuestion, 'Appeal made on behalf of');
    verifyFullAppealCYAChangLink(getPlanningAppMadeOnBehalfOfChangeLink, '/full-appeal/submit-appeal/applicant-name');
    verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfNameAnswer, applicantName);
    verifyFullAppealCYAAnswer(getPlanningAppMadeOnBehalfOfCompanyAnswer, originalAppellantCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, agentFullNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, agentCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, agentEmailText);
  }
});

Then('appellant is displayed answers for appeal site for {string}, {string}, {string}, {string}, {string}, {string}, {string} and {string}', (own_land, own_some_land, knowTheOwners, agricultural_holding, visible_publicLand, tenant, other_tenants, health_and_safety) => {
  verifyFullAppealCYAQuestion(getAppealSiteAddressQuestion, 'Appeal site address');
  verifyFullAppealCYAChangLink(getAppealSiteAddressChangeLink, '/full-appeal/submit-appeal/appeal-site-address');
  verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine1);
  verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, addressLine2);
  verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, townCity);
  verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, county);
  verifyFullAppealCYAAnswer(getAppealSiteAddressAnswer, postcode);
  verifyFullAppealCYAQuestion(getOwnsAllTheLandInvolvedQuestion, 'Do you own the land involved in the appeal?');
  verifyFullAppealCYAChangLink(getOwnsAllTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/own-all-the-land');
  if (own_land === 'yes') {
    verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own all the land involved in the appeal');
  }else if(own_land === 'no') {
    if (own_some_land === 'yes') {
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own some of the land involved in the appeal');
      if (knowTheOwners === 'I know who owns some of the land') {
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
      }
      else if (knowTheOwners === 'No, I do not know who owns any of the land') {
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
      else if (knowTheOwners === 'Yes, I know who owns all the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'Yes, I know who owns all the land');
        verifyFullAppealCYAQuestion(getTellingTheOtherLandownersQuestion, 'Telling the other landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerAllOtherLandowners, "I've told all the other landowners about my appeal");
        verifyFullAppealCYAChangLink(getTellingTheOtherLandownersChangeLink, '/full-appeal/submit-appeal/telling-the-landowners');
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getTellingTheOtherLandownersAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
        verifyFullAppealCYAQuestion(getOwnsRestOfTheLandInvolvedQuestion, 'Do you know who owns the rest of the land involved in the appeal?');
        verifyFullAppealCYAChangLink(getOwnsRestOfTheLandInvolvedChangeLink, '/full-appeal/submit-appeal/know-the-owners');
      }
    }
    else if (own_some_land === 'no') {
      verifyFullAppealCYAAnswer(getOwnsAllTheLandInvolvedAnswer, 'You own none of the land involved in the appeal');
      if (knowTheOwners === 'I know who owns some of the land') {
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
      } else if (knowTheOwners === 'No, I do not know who owns any of the land') {
        verifyFullAppealCYAAnswer(getOwnsRestOfTheLandInvolvedAnswer, 'No, I do not know who owns any of the land');
        verifyFullAppealCYAQuestion(getIdentifyOtherLandownersQuestion, 'Identifying the landowners');
        verifyFullAppealCYAChangLink(getIdentifyOtherLandownersChangeLink, '/full-appeal/submit-appeal/identifying-the-owners');
        verifyFullAppealCYAAnswer(getIdentifyOtherLandownersAnswer, "I confirm that I've attempted to identify all the landowners, but have not been successful");
        verifyFullAppealCYAQuestion(getAdvertisingYourAppealQuestion, 'Advertising your appeal');
        verifyFullAppealCYAChangLink(getAdvertisingYourAppealChangeLink, '/full-appeal/submit-appeal/advertising-your-appeal');
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerInThePress, "I've advertised my appeal in the press");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerLast21Days, "I've done this within the last 21 days");
        verifyFullAppealCYAAnswer(getAdvertisingYourAppealAnswerCopyOfForm, 'I used a copy of the form in annexe 2A or 2B');
      } else if (knowTheOwners === 'Yes, I know who owns all the land') {
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
  }
  verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
  verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
  if (agricultural_holding === 'no') {
    verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
  }else if(agricultural_holding === 'yes'){
    verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getAgriculturalHoldingTenantQuestion,'Are you a tenant of the agricultural holding?');
    verifyFullAppealCYAChangLink(getAgriculturalHoldingTenantChangeLink,'/full-appeal/submit-appeal/are-you-a-tenant');
    if(tenant==='yes'){
     verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer,'Yes');
     verifyFullAppealCYAQuestion(getAgriculturalHoldingOtherTenantQuestion,'Are there any other tenants?');
     verifyFullAppealCYAChangLink(getAgriculturalHoldingOtherTenantChangeLink,'/full-appeal/submit-appeal/other-tenants');
     if(other_tenants==='yes'){
       verifyFullAppealCYAAnswer(getAgriculturalHoldingOtherTenantAnswer,'Yes');
       verifyFullAppealCYAQuestion(getTellingTheOtherTenantsQuestion,'Telling the other tenants');
       verifyFullAppealCYAChangLink(getTellingTheOtherTenantsChangeLink,'/full-appeal/submit-appeal/telling-the-tenants');
       verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerAllOtherTenants,"I've told all the other tenants about my appeal");
       verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerLast21Days,"I've done this within the last 21 days");
       verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerCopyOfForm,'I used a copy of the form in annexe 2a');
     }else{
       verifyFullAppealCYAAnswer(getAgriculturalHoldingOtherTenantAnswer,'No');
     }
    }else{
      verifyFullAppealCYAAnswer(getAgriculturalHoldingTenantAnswer,'No');
      verifyFullAppealCYAQuestion(getTellingTheOtherTenantsQuestion,'Telling the tenants');
      verifyFullAppealCYAChangLink(getTellingTheOtherTenantsChangeLink,'/full-appeal/submit-appeal/telling-the-tenants');
      verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerAllOtherTenants,"I've told all the tenants about my appeal");
      verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerLast21Days,"I've done this within the last 21 days");
      verifyFullAppealCYAAnswer(getTellingTheOtherTenantsAnswerCopyOfForm,'I used a copy of the form in annexe 2a');
    }
  }
  verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
  verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
  if (visible_publicLand === 'yes') {
    verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
  }else{
    verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'No');
    verifyFullAppealCYAAnswer(getVisibleFromPublicRoadDetails,visibleFromRoadText);
  }
  verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
  verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
  if (health_and_safety === 'no') {
    verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
  }else{
    verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'Yes');
    verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesDetails,healthAndSafetyConcern);
  }
});

Then('appellant is displayed answers for deciding your appeal for {string}', (appeal_decision) => {
  verifyFullAppealCYAQuestion(getProcedureTypeQuestion, 'How would you prefer us to decide your appeal?');
  verifyFullAppealCYAChangLink(getProcedureTypeChangeLink, '/full-appeal/submit-appeal/how-decide-appeal');
  if (appeal_decision === 'Written representations') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Written Representation');
  } else if (appeal_decision === 'Hearing') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Hearing');
    verifyFullAppealCYAQuestion(getPreferAHearingQuestion, 'Why would you prefer a hearing?')
    verifyFullAppealCYAChangLink(getPreferAHearingChangeLink, '/full-appeal/submit-appeal/why-hearing');
    verifyFullAppealCYAAnswer(getPreferAHearingAnswer, textHearing);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion, 'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink, '/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer, draftStatementDocument);
  } else if (appeal_decision === 'Inquiry') {
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
  }
});

Then('appellant is displayed answers for planning application for {string}', (design_access_statement) => {
  verifyFullAppealCYAQuestion(getPlanningApplicationNumberQuestion, 'Planning application number');
  verifyFullAppealCYAChangLink(getPlanningApplicationNumberChangeLink, '/full-appeal/submit-appeal/application-number');
  verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer, planningAppNumberText);
  verifyFullAppealCYAQuestion(getPlanningApplicationFormQuestion, 'Planning application form');
  verifyFullAppealCYAChangLink(getPlanningApplicationFormChangeLink, '/full-appeal/submit-appeal/application-form');
  verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer, planningAppFormDocument);
  verifyFullAppealCYAQuestion(getDesignAccessStatementSubmittedQuestion, 'Design and access statement submitted with application');
  verifyFullAppealCYAChangLink(getDesignAccessStatementSubmittedChangeLink, '/full-appeal/submit-appeal/design-access-statement-submitted');
  verifyFullAppealCYAQuestion(getPlansDrawingSupportingDocumentsQuestion,'Plans, drawings and supporting documents');
  verifyFullAppealCYAAnswer(getPlansDrawingSupportingDocumentsAnswer,plansAndDrawingsDocument);
  verifyFullAppealCYAChangLink(getPlansDrawingSupportingDocumentsChangeLink,'/full-appeal/submit-appeal/plans-drawings-documents');
  if (design_access_statement === 'no') {
    verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'No');
  } else if (design_access_statement === 'yes') {
    verifyFullAppealCYAAnswer(getDesignAccessStatementSubmittedAnswer, 'Yes');
   verifyFullAppealCYAQuestion(getDesignAccessStatementQuestion,'Design and access statement');
   verifyFullAppealCYAChangLink(getDesignAccessStatementChangeLink,'/full-appeal/submit-appeal/design-access-statement');
   verifyFullAppealCYAAnswer(getDesignAccessStatementAnswer,designAccessStatementDocument);
  }
  verifyFullAppealCYAQuestion(getDecisionLetterQuestion, 'Decision letter');
  verifyFullAppealCYAChangLink(getDecisionLetterChangeLink, '/full-appeal/submit-appeal/decision-letter');
  verifyFullAppealCYAAnswer(getDecisionLetterAnswer, decisionLetter);
});

Then('appellant is displayed answers for appeal for {string} and {string}', (plans_and_drawings, supporting_documents) => {
  verifyFullAppealCYAQuestion(getAppealStatementQuestion, 'Appeal statement');
  verifyFullAppealCYAChangLink(getAppealStatementChangeLink, '/full-appeal/submit-appeal/appeal-statement');
  verifyFullAppealCYAAnswer(getAppealStatementAnswer, appealStatement);
  verifyFullAppealCYAQuestion(getPlansOrDrawingSupportingQuestion, 'Any plans or drawings to support your appeal');
  verifyFullAppealCYAChangLink(getPlansOrDrawingSupportingChangeLink, '/full-appeal/submit-appeal/plans-drawings');
  if (plans_and_drawings === 'no') {
    verifyFullAppealCYAAnswer(getPlansOrDrawingSupportingAnswer, 'No');
  } else if (plans_and_drawings === 'yes') {
    verifyFullAppealCYAAnswer(getPlansOrDrawingSupportingAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getPlansOrDrawingQuestion, 'Plans and drawings');
    verifyFullAppealCYAChangLink(getPlansOrDrawingChangeLink, '/full-appeal/submit-appeal/new-plans-drawings');
    verifyFullAppealCYAAnswer(getPlansOrDrawingAnswer, plansAndDrawings);
  }
  verifyFullAppealCYAQuestion(getDocumentsToSupportAppealQuestion, 'Any documents to support your appeal');
  verifyFullAppealCYAChangLink(getDocumentsToSupportAppealChangeLink, '/full-appeal/submit-appeal/supporting-documents');
  if (supporting_documents === 'no') {
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'No');
  } else if (supporting_documents === 'yes') {
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer, 'Yes');
    verifyFullAppealCYAQuestion(getSupportingDocumentsAppealQuestion, 'Supporting documents');
    verifyFullAppealCYAChangLink(getSupportingDocumentsAppealChangeLink, '/full-appeal/submit-appeal/new-supporting-documents');
    verifyFullAppealCYAAnswer(getSupportingDocumentsAppealAnswer, supportingDocument);
  }
})
