/* eslint-disable no-param-reassign */
module.exports = (appeal) => {
  appeal.horizonId = 'H0r1Z0N';
  appeal.lpaCode = 'E60000281/new';
  appeal.decisionDate = new Date().toISOString();
  appeal.state = 'DRAFT';
  appeal.eligibility = {
    enforcementNotice: true,
    householderPlanningPermission: true,
    isClaimingCosts: false,
    isListedBuilding: false,
  };
  appeal.aboutYouSection.yourDetails = {
    isOriginalApplicant: false,
    name: 'Ms Alison Khan',
    email: 'akhan123@email.com',
    appealingOnBehalfOf: 'Mr Josh Evans',
  };
  appeal.requiredDocumentsSection.applicationNumber = 'S/35552';
  appeal.requiredDocumentsSection.originalApplication.uploadedFile = {
    name: 'my_uploaded_file_original_application.pdf',
    originalFileName: 'my_uploaded_file_original_application.pdf',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };
  appeal.requiredDocumentsSection.decisionLetter.uploadedFile = {
    name: 'my_uploaded_file_decision_letter.pdf',
    originalFileName: 'my_uploaded_file_decision_letter.pdf',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };
  appeal.yourAppealSection.appealStatement.uploadedFile = {
    name: 'my_uploaded_file_appeal_statement.pdf',
    originalFileName: 'my_uploaded_file_appeal_statement.pdf',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };
  appeal.yourAppealSection.appealStatement.hasSensitiveInformation = false;
  appeal.yourAppealSection.otherDocuments.uploadedFiles = [
    {
      name: 'my_uploaded_file_other_documents_one.pdf',
      originalFileName: 'my_uploaded_file_other_documents_one.pdf',
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    {
      name: 'my_uploaded_fileother_documents_two.pdf',
      originalFileName: 'my_uploaded_fileother_documents_two.pdf',
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
  ];
  appeal.appealSiteSection.siteAddress = {
    addressLine1: 'The Grand House',
    addressLine2: 'High Street',
    town: 'Swansea',
    county: 'Dinas a Sir Abertawe',
    postcode: 'SA21 5TY',
  };
  appeal.appealSiteSection.siteOwnership = {
    ownsWholeSite: false,
    haveOtherOwnersBeenTold: true,
  };
  appeal.appealSiteSection.siteAccess = {
    canInspectorSeeWholeSiteFromPublicRoad: false,
    howIsSiteAccessRestricted: 'There is a moat',
  };
  appeal.appealSiteSection.healthAndSafety = {
    hasIssues: true,
    healthAndSafetyIssues: 'Site was a munitions dump!',
  };
  appeal.appealSubmission.appealPDFStatement.uploadedFile = {
    name: 'c9ce252a-9843-45d9-ab3c-a80590a38282.pdf',
    originalFileName: 'c9ce252a-9843-45d9-ab3c-a80590a38282.pdf',
    id: 'c9ce252a-9843-45d9-ab3c-a80590a38282',
  };
  appeal.sectionStates.aboutYouSection = {
    yourDetails: 'NOT STARTED',
  };
  appeal.sectionStates.requiredDocumentsSection = {
    applicationNumber: 'IN PROGRESS',
    originalApplication: 'COMPLETED',
    decisionLetter: 'NOT STARTED',
  };
  appeal.sectionStates.yourAppealSection = {
    appealStatement: 'IN PROGRESS',
    otherDocuments: 'COMPLETED',
  };
  appeal.sectionStates.appealSiteSection = {
    siteAddress: 'COMPLETED',
    siteAccess: 'IN PROGRESS',
    siteOwnership: 'COMPLETED',
    healthAndSafety: 'NOT STARTED',
  };
};
