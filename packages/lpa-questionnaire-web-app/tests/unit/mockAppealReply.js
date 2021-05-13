module.exports = {
  id: 'mock-id',
  appealId: '89aa8504-773c-42be-bb68-029716ad9756',
  state: 'COMPLETED',
  lpaCode: 'E69999999',
  aboutAppealSection: {
    submissionAccuracy: {
      accurateSubmission: false,
      inaccuracyReason:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
    },
    extraConditions: {
      hasExtraConditions: true,
      extraConditions:
        'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.\n\nSed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.',
    },
    otherAppeals: {
      adjacentAppeals: true,
      appealReferenceNumbers: 'abc-123, def-456',
    },
  },
  aboutAppealSiteSection: {
    aboutSite: {
      cannotSeeLand: null,
      wouldNeedToEnter: null,
      wouldNeedNeighbourAccess: null,
      wouldAffectListedBuilding: null,
      isGreenBelt: null,
      isConservationArea: null,
    },
  },
  requiredDocumentsSection: {
    plansDecision: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    officersReport: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    representationsInterestedParties: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    interestedPartiesAppeal: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    siteNotices: null,
    planningHistory: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    statutoryDevelopment: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    otherPolicies: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: [
        {
          name: 'upload-file-valid.pdf',
          id: '843dd1fc-6cd9-451f-a2a1-9107a85528e2',
        },
      ],
    },
    developmentOrNeighbourhood: {
      hasPlanSubmitted: true,
      planChanges: 'mock plan changes',
    },
  },
  sectionStates: {
    aboutAppealSection: {
      submissionAccuracy: 'COMPLETED',
      extraConditions: 'COMPLETED',
      otherAppeals: 'COMPLETED',
    },
    aboutAppealSiteSection: {
      aboutSite: 'COMPLETED',
    },
    requiredDocumentsSection: {
      plansDecision: 'COMPLETED',
      officersReport: 'COMPLETED',
    },
    optionalDocumentsSection: {
      interestedPartiesApplication: 'COMPLETED',
      representationsInterestedParties: 'COMPLETED',
      interestedPartiesAppeal: 'COMPLETED',
      siteNotices: 'COMPLETED',
      planningHistory: 'COMPLETED',
      statutoryDevelopment: 'COMPLETED',
      otherPolicies: 'COMPLETED',
      supplementaryPlanningDocuments: 'COMPLETED',
      developmentOrNeighbourhood: 'COMPLETED',
    },
  },
};
