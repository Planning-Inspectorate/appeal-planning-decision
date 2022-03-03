//contact details
export const getContactDetailsSectionHeading = () =>  cy.get('[data-cy="contact-details-heading"]');
//planning application made in your name
export const getPlanningAppMadeInYourNameQuestion = () =>  cy.get('[data-cy="is-original-applicant-label"]');
export const getPlanningAppMadeInYourNameAnswer = () =>  cy.get('[data-cy="is-original-applicant"]');
export const getPlanningAppMadeInYourNameChangeLink =() => cy.get('[data-cy="change-is-original-applicant"]');
//planning application made by agent
export const getPlanningAppMadeOnBehalfOfQuestion = () =>  cy.get('[data-cy="appealing-on-behalf-of-label"]');
export const getPlanningAppMadeOnBehalfOfNameAnswer = () =>  cy.get('[data-cy="appealing-on-behalf-of-name"]');
export const getPlanningAppMadeOnBehalfOfCompanyAnswer = () =>  cy.get('[data-cy="appealing-on-behalf-of-company"]');
export const getPlanningAppMadeOnBehalfOfChangeLink =() => cy.get('[data-cy="change-appealing-on-behalf-of"]');
//contact details
export const getPlanningAppContactDetailsQuestion = () =>  cy.get('[data-cy="contact-details-label"]');
export const getPlanningAppContactDetailsNameAnswer = () =>  cy.get('[data-cy="contact-details-name"]');
export const getPlanningAppContactDetailsCompanyAnswer = () =>  cy.get('[data-cy="contact-details-company"]');
export const getPlanningAppContactDetailsEmailAnswer = () =>  cy.get('[data-cy="contact-details-email"]');
export const getPlanningAppContactDetailsChangeLink =() => cy.get('[data-cy="change-contact-details"]');

//appeal site
export const getAppealSiteSectionHeading = () =>  cy.get('[data-cy="appeal-site-heading"]');
//appeal site address
export const getAppealSiteAddressQuestion = () =>  cy.get('[data-cy="site-address-label"]');
export const getAppealSiteAddressAnswer = () =>  cy.get('[data-cy="site-address"]');
export const getAppealSiteAddressChangeLink =() => cy.get('[data-cy="change-site-address"]');
//own the land
export const getOwnsAllTheLandInvolvedQuestion = () =>  cy.get('[data-cy="owns-all-the-land-label"]');
export const getOwnsAllTheLandInvolvedAnswer = () =>  cy.get('[data-cy="owns-all-the-land"]');
export const getOwnsAllTheLandInvolvedChangeLink =() => cy.get('[data-cy="change-owns-all-the-land"]');
//Telling the other landowners
export const getTellingTheOtherLandownersQuestion = () =>  cy.get('[data-cy="telling-other-landowners-label"]');
export const getTellingTheOtherLandownersAnswerAllOtherLandowners = () =>  cy.get('[data-cy="telling-other-landowners-1"]');
export const getTellingTheOtherLandownersAnswerLast21Days = () =>  cy.get('[data-cy="telling-other-landowners-2"]');
export const getTellingTheOtherLandownersAnswerCopyOfForm = () =>  cy.get('[data-cy="telling-other-landowners-3"]');
export const getTellingTheOtherLandownersChangeLink =() => cy.get('[data-cy="change-telling-other-landowners"]');
//owns rest of the land
export const getOwnsRestOfTheLandInvolvedQuestion = () =>  cy.get('[data-cy="know-the-owners-label"]');
export const getOwnsRestOfTheLandInvolvedAnswer = () =>  cy.get('[data-cy="know-the-owners"]');
export const getOwnsRestOfTheLandInvolvedChangeLink =() => cy.get('[data-cy="change-know-the-owners"]');
//advertising the appeal
export const getAdvertisingYourAppealQuestion = () =>  cy.get('[data-cy="advertising-your-appeal-label"]');
export const getAdvertisingYourAppealAnswerInThePress = () =>  cy.get('[data-cy="advertising-your-appeal-1"]');
export const getAdvertisingYourAppealAnswerLast21Days = () =>  cy.get('[data-cy="advertising-your-appeal-2"]');
export const getAdvertisingYourAppealAnswerCopyOfForm = () =>  cy.get('[data-cy="advertising-your-appeal-3"]');
export const getAdvertisingYourAppealChangeLink =() => cy.get('[data-cy="change-advertising-your-appeal"]');
//Identify other landowners
export const getIdentifyOtherLandownersQuestion = () =>  cy.get('[data-cy="identifying-the-landowners-label"]');
export const getIdentifyOtherLandownersAnswer = () =>  cy.get('[data-cy="identifying-the-landowners"]');
export const getIdentifyOtherLandownersChangeLink =() => cy.get('[data-cy="change-identifying-the-landowners"]');
//appeal site part of agricultural holding
export const getAgriculturalHoldingQuestion = () =>  cy.get('[data-cy="is-agricultural-holding-label"]');
export const getAgriculturalHoldingAnswer = () =>  cy.get('[data-cy="is-agricultural-holding"]');
export const getAgriculturalHoldingChangeLink =() => cy.get('[data-cy="change-is-agricultural-holding"]');
//tenant of agricultural holding
export const getAgriculturalHoldingTenantQuestion = () =>  cy.get('[data-cy="is-agricultural-holding-tenant-label"]');
export const getAgriculturalHoldingTenantAnswer = () =>  cy.get('[data-cy="is-agricultural-holding-tenant"]');
export const getAgriculturalHoldingTenantChangeLink =() => cy.get('[data-cy="change-is-agricultural-holding-tenant"]');
//other tenant of agricultural holding
export const getAgriculturalHoldingOtherTenantQuestion = () =>  cy.get('[data-cy="has-other-tenants-label"]');
export const getAgriculturalHoldingOtherTenantAnswer = () =>  cy.get('[data-cy="has-other-tenants"]');
export const getAgriculturalHoldingOtherTenantChangeLink =() => cy.get('[data-cy="change-has-other-tenants"]');
//Telling Other tenants
export const getTellingTheOtherTenantsQuestion = () =>  cy.get('[data-cy="telling-the-tenants-label"]');
export const getTellingTheOtherTenantsAnswerAllOtherTenants = () =>  cy.get('[data-cy="telling-the-tenants-1"]');
export const getTellingTheOtherTenantsAnswerLast21Days = () =>  cy.get('[data-cy="telling-the-tenants-2"]');
export const getTellingTheOtherTenantsAnswerCopyOfForm = () =>  cy.get('[data-cy="telling-the-tenants-3"]');
export const getTellingTheOtherTenantsChangeLink =() => cy.get('[data-cy="change-telling-the-tenants"]');
//visible from public land
export const getVisibleFromPublicLandQuestion = () =>  cy.get('[data-cy="is-visible-from-road-label"]');
export const getVisibleFromPublicLandAnswer = () =>  cy.get('[data-cy="is-visible-from-road"]');
export const getVisibleFromPublicLandChangeLink =() => cy.get('[data-cy="change-is-visible-from-road"]');
export const getVisibleFromPublicRoadDetails = () => cy.get('[data-cy=visible-from-road-details]');
//Health and safety
export const getHealthAndSafetyIssuesQuestion = () =>  cy.get('[data-cy="has-health-safety-issues-label"]');
export const getHealthAndSafetyIssuesAnswer = () =>  cy.get('[data-cy="has-health-safety-issues"]');
export const getHealthAndSafetyIssuesChangeLink =() => cy.get('[data-cy="change-has-health-safety-issues"]');
export const getHealthAndSafetyIssuesDetails = () => cy.get('[data-cy=health-safety-details]');

//Deciding your appeal
export const getDecidingYourAppealSectionHeading = () =>  cy.get('[data-cy="appeal-site-heading"]');
//How would you prefer to decide appeal
export const getProcedureTypeQuestion = () =>  cy.get('[data-cy="procedure-type-label"]');
export const getProcedureTypeAnswer = () =>  cy.get('[data-cy="procedure-type"]');
export const getProcedureTypeChangeLink =() => cy.get('[data-cy="change-procedure-type"]');
//prefer a hearing
export const getPreferAHearingQuestion = () =>  cy.get('[data-cy="hearing-reason-label"]');
export const getPreferAHearingAnswer = () =>  cy.get('[data-cy="hearing-reason"]');
export const getPreferAHearingChangeLink =() => cy.get('[data-cy="change-hearing-reason"]');
//Prefer an Inquiry
export const getPreferAnInquiryQuestion = () =>  cy.get('[data-cy="inquiry-reason-label"]');
export const getPreferAnInquiryAnswer = () =>  cy.get('[data-cy="inquiry-reason"]');
export const getPreferAnInquiryChangeLink =() => cy.get('[data-cy="change-inquiry-reason"]');
//Days for Inquiry
export const getNumberOfDaysForInquiryQuestion = () =>  cy.get('[data-cy="inquiry-expected-days-label"]');
export const getNumberOfDaysForInquiryAnswer = () =>  cy.get('[data-cy="inquiry-expected-days"]');
export const getNumberOfDaysForInquiryChangeLink =() => cy.get('[data-cy="change-inquiry-expected-days"]');
//statement of Common ground
export const getStatementOfCommonGroundQuestion = () =>  cy.get('[data-cy="draft-statement-of-common-ground-label"]');
export const getStatementOfCommonGroundAnswer = () =>  cy.get('[data-cy="draft-statement-of-common-ground"]');
export const getStatementOfCommonGroundChangeLink =() => cy.get('[data-cy="change-draft-statement-of-common-ground"]'); // No page object defined

//Your planning application
export const getYourPlanningApplicationSectionHeading = () =>  cy.get('[data-cy="planning-application-heading"]');
//Planning application number
export const getPlanningApplicationNumberQuestion = () =>  cy.get('[data-cy="application-number-label"]');
export const getPlanningApplicationNumberAnswer = () =>  cy.get('[data-cy="application-number"]');
export const getPlanningApplicationNumberChangeLink =() => cy.get('[data-cy="change-application-number"]');
//Plans drawings supporting documents
export const getPlansDrawingSupportingDocumentsQuestion = () =>  cy.get('[data-cy="plans-drawings-supporting-documents-label"]');
export const getPlansDrawingSupportingDocumentsAnswer = () =>  cy.get('[data-cy="plans-drawings-supporting-documents-1"]');
export const getPlansDrawingSupportingDocumentsChangeLink =() => cy.get('[data-cy="change-plans-drawings-supporting-documents"]');
//planning application form
export const getPlanningApplicationFormQuestion = () =>  cy.get('[data-cy="application-form-label"]');
export const getPlanningApplicationFormAnswer = () =>  cy.get('[data-cy="application-form"]');
export const getPlanningApplicationFormChangeLink =() => cy.get('[data-cy="change-application-form"]');
//Design access statement Submitted
export const getDesignAccessStatementSubmittedQuestion = () =>  cy.get('[data-cy="has-design-access-statement-label"]');
export const getDesignAccessStatementSubmittedAnswer = () =>  cy.get('[data-cy="has-design-access-statement"]');
export const getDesignAccessStatementSubmittedChangeLink =() => cy.get('[data-cy="change-has-design-access-statement"]');
//Design access statement
export const getDesignAccessStatementQuestion = () =>  cy.get('[data-cy="design-access-statement-label"]');
export const getDesignAccessStatementAnswer = () =>  cy.get('[data-cy="design-access-statement"]');
export const getDesignAccessStatementChangeLink =() => cy.get('[data-cy="change-design-access-statement"]');
//Decision letter
export const getDecisionLetterQuestion = () =>  cy.get('[data-cy="decision-letter-label"]');
export const getDecisionLetterAnswer = () =>  cy.get('[data-cy="decision-letter"]');
export const getDecisionLetterChangeLink =() => cy.get('[data-cy="change-decision-letter"]');

//Your Appeal
export const getYourAppealSectionHeading = () =>  cy.get('[data-cy="your-appeal-heading"]');
//Appeal Statement
export const getAppealStatementQuestion = () =>  cy.get('[data-cy="appeal-statement-label"]');
export const getAppealStatementAnswer = () =>  cy.get('[data-cy="appeal-statement"]');
export const getAppealStatementChangeLink =() => cy.get('[data-cy="change-appeal-statement"]'); // No page object defined
//Plans or Drawing to support appeal
export const getPlansOrDrawingSupportingQuestion = () =>  cy.get('[data-cy="has-plans-drawings-label"]');
export const getPlansOrDrawingSupportingAnswer = () =>  cy.get('[data-cy="has-plans-drawings"]');
export const getPlansOrDrawingSupportingChangeLink =() => cy.get('[data-cy="change-has-plans-drawings"]');
// New Plans and Drawings
export const getPlansOrDrawingQuestion = () =>  cy.get('[data-cy="plans-drawings-label"]');
export const getPlansOrDrawingAnswer = () =>  cy.get('[data-cy="plans-drawings-1"]');
export const getPlansOrDrawingChangeLink =() => cy.get('[data-cy="change-plans-drawings"]');
//Any documents to support appeal
export const getDocumentsToSupportAppealQuestion = () =>  cy.get('[data-cy="has-supporting-documents-label"]');
export const getDocumentsToSupportAppealAnswer = () =>  cy.get('[data-cy="has-supporting-documents"]');
export const getDocumentsToSupportAppealChangeLink =() => cy.get('[data-cy="change-has-supporting-documents"]');
//Supporting documents
export const getSupportingDocumentsAppealQuestion = () =>  cy.get('[data-cy="supporting-documents-label"]');
export const getSupportingDocumentsAppealAnswer = () =>  cy.get('[data-cy="supporting-documents-1"]');
export const getSupportingDocumentsAppealChangeLink =() => cy.get('[data-cy="change-supporting-documents"]');

export const CheckYourAnswersLink = () =>  cy.get('[data-cy="submitYourAppealSection"]');
export const yourContactDetails = () => cy.get('.govuk-summary-list__key');




