import {Given, Then, When} from 'cypress-cucumber-preprocessor/steps';
import {
  CheckYourAnswersLink,
  getAgriculturalHoldingAnswer,
  getAgriculturalHoldingChangeLink,
  getAgriculturalHoldingQuestion,
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
  getDocumentsToSupportAppealAnswer,
  getDocumentsToSupportAppealChangeLink,
  getDocumentsToSupportAppealQuestion,
  getHealthAndSafetyIssuesAnswer,
  getHealthAndSafetyIssuesChangeLink,
  getHealthAndSafetyIssuesQuestion,
  getNumberOfDaysForInquiryAnswer,
  getNumberOfDaysForInquiryChangeLink,
  getNumberOfDaysForInquiryQuestion,
  getOwnsAllTheLandInvolvedAnswer,
  getOwnsAllTheLandInvolvedChangeLink,
  getOwnsAllTheLandInvolvedQuestion,
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
  getPlanningAppMadeOnBehalfOfQuestion,
  getPlansOrDrawingAnswer,
  getPlansOrDrawingChangeLink,
  getPlansOrDrawingQuestion,
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
  getVisibleFromPublicLandAnswer,
  getVisibleFromPublicLandChangeLink,
  getVisibleFromPublicLandQuestion,
  getYourAppealSectionHeading,
  getYourPlanningApplicationSectionHeading,
} from '../../../../../support/full-appeal/appeals-service/page-objects/check-your-answers-po';
import {getFileUploadButton} from '../../../../../support/common-page-objects/common-po';
import {verifyPageTitle} from '../../../../../support/common/verify-page-title';
import {verifyPageHeading} from '../../../../../support/common/verify-page-heading';
import {
  linkDecideYourAppeal,
  linkProvideYourContactDetails,
  linkTellAboutTheAppealSite,
  linkUploadDocsForYourAppeal,
  linkUploadDocsFromPlanningApplication,
  pageCaptionText
} from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
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
  provideAddressLine1
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1";
import {providePostcode} from "../../../../../support/common/appeal-submission-appeal-site-address/providePostcode";
import {selectNo, selectYes} from "../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po";
import {
  selectHearing, selectInquiry,
  selectWrittenRepresentations, textBoxExpectDays, textBoxInquiry, textBoxWhyHearing
} from "../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po";
import {
  planningApplicationNumber
} from "../../../../../support/full-appeal/appeals-service/page-objects/planning-application-number-po";
import {
  checkboxConfirmSensitiveInfo
} from "../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po";
import {
  verifyFullAppealCYAQuestion
} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAQuestion";
import {
  verifyFullAppealCYAChangLink
} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAChangLink";
import {verifyFullAppealCYAAnswer} from "../../../../../support/full-appeal/appeals-service/check-your-answers/verifyFullAppealCYAAnswer";
import {
  provideAddressLine2
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2";
import {provideTownOrCity} from "../../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity";
import {provideCounty} from "../../../../../support/common/appeal-submission-appeal-site-address/provideCounty";

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
const whyHearingUrl='full-appeal/submit-appeal/why-hearing';
const textHearing='I want to provide the facts of the Appeal for the formal decision';
const daysToExpectTheInquiryUrl = 'full-appeal/submit-appeal/expect-inquiry-last';
const planningAppFormUrl = 'full-appeal/submit-appeal/application-form';
const planningAppNumberUrl = 'full-appeal/submit-appeal/application-number';
const designAccessStatementSubmittedUrl = 'full-appeal/submit-appeal/design-access-statement-submitted';
const designAccessStatementUrl = 'full-appeal/submit-appeal/design-access-statement';
const decisionLetterUrl = 'full-appeal/submit-appeal/decision-letter';
const whyInquiryUrl = 'full-appeal/submit-appeal/why-inquiry';
const planningAppNumberText = 'PNO-TEST123';
const textInquiry = 'I want to take part in the inquiry process - 123456789';
const plansDrawingsUrl = 'full-appeal/submit-appeal/plans-drawings';
const supportingDocumentsUrl = 'full-appeal/submit-appeal/supporting-documents';
const newSupportingDocumentsUrl = 'full-appeal/submit-appeal/new-supporting-documents';
const planningAppFormDocument ='upload-file-valid.jpeg';
const decisionLetter='upload-file-valid.pdf';
const appealStatement = 'upload-file-valid.jpeg';
const draftStatementDocument = 'upload-file-valid.png';
const draftStatementUrl = 'full-appeal/submit-appeal/draft-statement-common-ground';
const validNumberDays = '10';
const designAccessStatementDocument = 'upload-file-valid.tiff';


Given('the appellant has provided details for {string}', (contact_Details) => {
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
});

Given('appellant provides the details for {string}, {string}, {string} and {string}', (own_land, agricultural_holding, visible_publicLand, health_and_safety) => {
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
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalLandHoldingUrl);
  if (agricultural_holding === 'no') {
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', visibleFromPublicLandUrl);
  if (visible_publicLand === 'yes') {
    selectYes().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', healthAndSafetyUrl);
  if (health_and_safety === 'no') {
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
});

Given('appellant provides the details about {string} preference', (appeal_decision) => {
  linkDecideYourAppeal().click();
  cy.url().should('contain', decideAppealUrl);
  if (appeal_decision === 'Written representations') {
    selectWrittenRepresentations().click();
    getSaveAndContinueButton().click();
  }else if(appeal_decision==='Hearing'){
    selectHearing().click();
    getSaveAndContinueButton().click();
    cy.url().should('include', whyHearingUrl);
    textBoxWhyHearing().clear().type(textHearing);
    getSaveAndContinueButton().click();
    cy.url().should('include', draftStatementUrl);
    getFileUploadButton().attachFile(draftStatementDocument);
    getSaveAndContinueButton().click();
  }else if(appeal_decision==='Inquiry'){
    selectInquiry().click();
    getSaveAndContinueButton().click();
    cy.url().should('include', whyInquiryUrl);
    textBoxInquiry().clear().type(textInquiry);
    getSaveAndContinueButton().click();
    cy.url().should('include',daysToExpectTheInquiryUrl);
    textBoxExpectDays().clear().type(validNumberDays);
    getSaveAndContinueButton().click();
    cy.url().should('include', draftStatementUrl);
    getFileUploadButton().attachFile(draftStatementDocument);
    getSaveAndContinueButton().click();
  }
  cy.url().should('contain', taskListUrl);
});

Given('appellant uploads documents from planning application and design and access statement as {string}', (design_access_statement) => {
  linkUploadDocsFromPlanningApplication().click();
  cy.url().should('contain', planningAppFormUrl);
  getFileUploadButton().attachFile(planningAppFormDocument);
  getSaveAndContinueButton().click();
  cy.url().should('contain', planningAppNumberUrl);
  planningApplicationNumber().clear().type(planningAppNumberText);
  getSaveAndContinueButton().click();
  cy.url().should('contain', designAccessStatementSubmittedUrl);
  if (design_access_statement === 'no') {
    selectNo().click();
  }else if(design_access_statement==='yes'){
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
});

Given('appellant uploads documents for appeal for plans and drawings {string} and supporting documents {string}', (plans_and_drawings, supporting_documents) => {
  linkUploadDocsForYourAppeal().click();
  getFileUploadButton().attachFile(appealStatement);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansDrawingsUrl);
  if (plans_and_drawings === 'no') {
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', supportingDocumentsUrl);
  if (supporting_documents === 'no') {
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', taskListUrl);
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
  verifyFullAppealCYAChangLink(getPlanningAppContactDetailsChangeLink, '/full-appeal/submit-appeal/contact-details');
  if (contact_details === 'appellant') {
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, 'Yes, the planning application was made in my name');
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, originalAppellantFullNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, originalAppellantCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, originalAppellantEmailText);
  } else if (contact_details === 'agent') {
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, "No, I'm acting on behalf of the appellant");
    verifyFullAppealCYAQuestion(getPlanningAppMadeOnBehalfOfQuestion, 'Appeal made on behalf of');
    verifyFullAppealCYAChangLink(getPlanningAppMadeOnBehalfOfChangeLink, '/full-appeal/submit-appeal/contact-details');
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, applicantName);
    verifyFullAppealCYAAnswer(getPlanningAppMadeInYourNameAnswer, originalAppellantCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsNameAnswer, agentFullNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsCompanyAnswer, agentCompanyNameText);
    verifyFullAppealCYAAnswer(getPlanningAppContactDetailsEmailAnswer, agentEmailText);
  }
});

Then('appellant is displayed answers for appeal site for {string}, {string}, {string} and {string}', (own_land, agricultural_holding, visible_publicLand, health_and_safety) => {
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
  }
  verifyFullAppealCYAQuestion(getAgriculturalHoldingQuestion, 'Is the appeal site part of an agricultural holding?');
  verifyFullAppealCYAChangLink(getAgriculturalHoldingChangeLink, '/full-appeal/submit-appeal/agricultural-holding');
  if (agricultural_holding === 'no') {
    verifyFullAppealCYAAnswer(getAgriculturalHoldingAnswer, 'No');
  }
  verifyFullAppealCYAQuestion(getVisibleFromPublicLandQuestion, 'Visible from a public road');
  verifyFullAppealCYAChangLink(getVisibleFromPublicLandChangeLink, '/full-appeal/submit-appeal/visible-from-road');
  if (visible_publicLand === 'yes') {
    verifyFullAppealCYAAnswer(getVisibleFromPublicLandAnswer, 'Yes');
  }
  verifyFullAppealCYAQuestion(getHealthAndSafetyIssuesQuestion, 'Health and safety issues');
  verifyFullAppealCYAChangLink(getHealthAndSafetyIssuesChangeLink, '/full-appeal/submit-appeal/health-safety-issues');
  if (health_and_safety === 'no') {
    verifyFullAppealCYAAnswer(getHealthAndSafetyIssuesAnswer, 'No');
  }
});

Then('appellant is displayed answers for deciding your appeal for {string}', (appeal_decision) => {
  verifyFullAppealCYAQuestion(getProcedureTypeQuestion, 'How would you prefer us to decide your appeal?');
  verifyFullAppealCYAChangLink(getProcedureTypeChangeLink, '/full-appeal/submit-appeal/how-decide-appeal');
  if(appeal_decision === 'Written representations') {
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Written Representation');
  }else if(appeal_decision==='Hearing'){
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Hearing');
    verifyFullAppealCYAQuestion(getPreferAHearingQuestion,'Why would you prefer a hearing?')
    verifyFullAppealCYAChangLink(getPreferAHearingChangeLink,'/full-appeal/submit-appeal/why-hearing');
    verifyFullAppealCYAAnswer(getPreferAHearingAnswer,textHearing);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion,'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink,'/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer,draftStatementDocument);
  }else if(appeal_decision==='Inquiry'){
    verifyFullAppealCYAAnswer(getProcedureTypeAnswer, 'Inquiry');
    verifyFullAppealCYAQuestion(getPreferAnInquiryQuestion,'Why would you prefer an inquiry?');
    verifyFullAppealCYAChangLink(getPreferAnInquiryChangeLink,'/full-appeal/submit-appeal/why-inquiry');
    verifyFullAppealCYAAnswer(getPreferAnInquiryAnswer,textInquiry);
    verifyFullAppealCYAQuestion(getNumberOfDaysForInquiryQuestion,'How many days would you expect the inquiry to last?');
    verifyFullAppealCYAChangLink(getNumberOfDaysForInquiryChangeLink,'/full-appeal/submit-appeal/expect-inquiry-last');
    verifyFullAppealCYAAnswer(getNumberOfDaysForInquiryAnswer,validNumberDays);
    verifyFullAppealCYAQuestion(getStatementOfCommonGroundQuestion,'Draft statement of common ground');
    verifyFullAppealCYAChangLink(getStatementOfCommonGroundChangeLink,'/full-appeal/submit-appeal/draft-statement-common-ground');
    verifyFullAppealCYAAnswer(getStatementOfCommonGroundAnswer,draftStatementDocument);
  }
});

Then('appellant is displayed answers for planning application for {string}', (design_access_statement) => {
  verifyFullAppealCYAQuestion(getPlanningApplicationNumberQuestion, 'Planning application number');
  verifyFullAppealCYAChangLink(getPlanningApplicationNumberChangeLink, '/full-appeal/submit-appeal/application-number');
  verifyFullAppealCYAAnswer(getPlanningApplicationNumberAnswer,planningAppNumberText);
  verifyFullAppealCYAQuestion(getPlanningApplicationFormQuestion,'Planning application form');
  verifyFullAppealCYAChangLink(getPlanningApplicationFormChangeLink,'/full-appeal/submit-appeal/application-form');
  verifyFullAppealCYAAnswer(getPlanningApplicationFormAnswer,planningAppFormDocument);
  verifyFullAppealCYAQuestion(getDesignAccessStatementQuestion,'Design and access statement submitted with application');
  verifyFullAppealCYAChangLink(getDesignAccessStatementChangeLink,'/full-appeal/submit-appeal/design-access-statement-submitted');
  if(design_access_statement==='no'){
    verifyFullAppealCYAAnswer(getDesignAccessStatementAnswer,'No');
  }else if(design_access_statement==='yes'){
    verifyFullAppealCYAAnswer(getDesignAccessStatementAnswer,'Yes');
   //revisit after David S fixes the page objects for Design and access statement
  }
  verifyFullAppealCYAQuestion(getDecisionLetterQuestion,'Decision letter');
  verifyFullAppealCYAChangLink(getDecisionLetterChangeLink,'/full-appeal/submit-appeal/decision-letter');
  verifyFullAppealCYAAnswer(getDecisionLetterAnswer,decisionLetter);
});

Then('appellant is displayed answers for appeal for {string} and {string}',(plans_and_drawings,supporting_documents)=>{
  verifyFullAppealCYAQuestion(getAppealStatementQuestion,'Appeal statement');
  verifyFullAppealCYAChangLink(getAppealStatementChangeLink,'/full-appeal/submit-appeal/appeal-statement');
  verifyFullAppealCYAAnswer(getAppealStatementAnswer,appealStatement);
  verifyFullAppealCYAQuestion(getPlansOrDrawingQuestion,'Any plans or drawings to support your appeal');
  verifyFullAppealCYAChangLink(getPlansOrDrawingChangeLink,'/full-appeal/submit-appeal/plans-drawings');
  if(plans_and_drawings==='no'){
    verifyFullAppealCYAAnswer(getPlansOrDrawingAnswer,'No');
  }
  verifyFullAppealCYAQuestion(getDocumentsToSupportAppealQuestion,'Any documents to support your appeal');
  verifyFullAppealCYAChangLink(getDocumentsToSupportAppealChangeLink,'/full-appeal/submit-appeal/supporting-documents');
  if(supporting_documents==='no'){
    verifyFullAppealCYAAnswer(getDocumentsToSupportAppealAnswer,'No');
  }
})
