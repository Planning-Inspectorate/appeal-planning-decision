const Mongoose = require('mongoose');
const replySchema = require('./replySchema');

const Model = Mongoose.model('Model', replySchema);
const popModel = new Model({
  id: '78a0e119-9f4e-4714-9050-f20555504cfd',
  appealId: 'e6d40357-c41a-43df-b2c5-1bcee4030f12',
  state: 'DRAFT',
  aboutAppealSection: {
    submissionAccuracy: true,
    extraConditions: {
      hasExtraConditions: true,
      extraConditions: 'One extra condition. Another extra condition',
    },
    otherAppeals: {
      adjacentAppeals: true,
      appealReferenceNumbers: '7892347587825037',
    },
  },
  aboutAppealSiteSection: {
    cannotSeeLand: true,
    wouldNeedToEnter: false,
    wouldNeedNeighbourAccess: true,
    wouldAffectListedBuilding: false,
    isGreenBelt: false,
    isConservationArea: false,
  },
  requiredDocumentsSection: {
    plansDecision: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_plans_decision.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    officersReport: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_officers_report.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_interested_parties_application.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    representationsInterestedParties: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_representations_interested_parties.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    interestedPartiesAppeal: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_interested_parties_appeal.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    siteNotices: true,
    planningHistory: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_planning_history.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    statutoryDevelopment: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_statutory_development.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    otherPolicies: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_other_polices.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
          status: 'this is a status',
          isSubjectPublicConsultation:
            'It was the subject of public consultation and consequenct modification',
          formalAdoption: 'was formally adopted, on this date',
          emergingDocument: 'is an emerging document at a certain stage',
        },
      ],
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: [
        {
          name: 'my_uploaded_file_supplementary_planning-documents.pdf',
          id: '78a0e119-9F4E-4714-9050-f20555504cfd6',
        },
      ],
    },
    developmentOrNeighbourhood: {
      hasPlanSubmitted: true,
      planChanges: 'This plan change, that plan change',
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
    submitReplySection: {
      checkYourAnswers: 'COMPLETED',
    },
  },
});

module.exports = { popModel };
