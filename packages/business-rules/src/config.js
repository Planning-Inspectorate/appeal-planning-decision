const { format } = require('date-fns');
const {
  APPEAL_ID,
  APPLICATION_DECISION,
  PROCEDURE_TYPE: { WRITTEN_REPRESENTATION, HEARING, INQUIRY },
} = require('./constants');
const formatAddress = require('./utils/format-address');

const config = {
  appeal: {
    type: {
      [APPEAL_ID.ENFORCEMENT_NOTICE]: {
        id: 'C',
        name: 'Enforcement Notice Appeal',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 28,
          duration: 'days',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.HOUSEHOLDER]: {
        id: 'D',
        name: 'Householder Appeal (HAS)',
        procedureType: [WRITTEN_REPRESENTATION],
        appealDue: {
          granted: {
            time: 6,
            duration: 'months',
          },
          refused: {
            time: 12,
            duration: 'weeks',
          },
          nodecisionreceived: {
            time: 6,
            duration: 'months',
          },
        },
        questionnaireDue: {
          time: 1,
          duration: 'weeks',
        },
        email: {
          appellant: (appeal, lpa) => ({
            recipientEmail: appeal.aboutYouSection.yourDetails.email,
            variables: {
              name: appeal.aboutYouSection.yourDetails.name,
              'appeal site address': formatAddress(appeal.appealSiteSection.siteAddress),
              'local planning department': lpa.name,
              'pdf copy URL': `${process.env.APP_APPEALS_BASE_URL}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`,
            },
            reference: appeal.id,
          }),
          lpa: (appeal, lpa) => ({
            recipientEmail: lpa.email,
            variables: {
              LPA: lpa.name,
              date: format(appeal.submissionDate, 'dd MMMM yyyy'),
              'planning application number': appeal.requiredDocumentsSection.applicationNumber,
              'site address': formatAddress(appeal.appealSiteSection.siteAddress),
            },
            reference: appeal.id,
          }),
        },
      },
      [APPEAL_ID.ENFORCEMENT_LISTED_BUILDING]: {
        id: 'F',
        name: 'Enforcement Listed Building and Conservation Area Appeal S39',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 6,
          duration: 'months',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.ADVERTISEMENT]: {
        id: 'H',
        name: 'Advertisement Appeal',
        procedureType: [WRITTEN_REPRESENTATION, HEARING],
        appealDue: {
          time: 8,
          duration: 'weeks',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.PLANNING_OBLIGATION]: {
        id: 'Q',
        name: 'Planning Obligation Appeal S106',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 6,
          duration: 'months',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.PLANNING_SECTION_78]: {
        id: 'W',
        name: 'Planning Appeal Section 78',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 6,
          duration: 'months',
        },
        questionnaireDue: {
          time: 1,
          duration: 'weeks',
        },
        email: {
          appellant: (appeal, lpa) => ({
            recipientEmail: appeal.contactDetailsSection.contact.email,
            variables: {
              name: appeal.contactDetailsSection.contact.name,
              'appeal site address': formatAddress(appeal.appealSiteSection.siteAddress),
              'local planning department': lpa.name,
              'link to pdf': `${process.env.APP_APPEALS_BASE_URL}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`,
            },
            reference: appeal.id,
          }),
          lpa: (appeal, lpa) => ({
            recipientEmail: lpa.email,
            variables: {
              'loca planning department': lpa.name,
              'submission date': format(appeal.submissionDate, 'dd MMMM yyyy'),
              'planning application number':
                appeal.planningApplicationDocumentsSection.applicationNumber,
              'site address': formatAddress(appeal.appealSiteSection.siteAddress),
              refused:
                appeal.eligibility.applicationDecision === APPLICATION_DECISION.REFUSED
                  ? 'yes'
                  : 'no',
              granted:
                appeal.eligibility.applicationDecision === APPLICATION_DECISION.GRANTED
                  ? 'yes'
                  : 'no',
              'non-determination':
                appeal.eligibility.applicationDecision === APPLICATION_DECISION.NODECISIONRECEIVED
                  ? 'yes'
                  : 'no',
            },
            reference: appeal.id,
          }),
        },
      },
      [APPEAL_ID.PLANNING_LISTED_BUILDING]: {
        id: 'Y',
        name: 'Planning Listed Building and Conservation Area Appeal S20',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 6,
          duration: 'months',
        },
        questionnaireDue: {
          time: 1,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.COMMERCIAL]: {
        id: 'Z',
        name: 'Commercial Appeal (CAS)',
        procedureType: [WRITTEN_REPRESENTATION],
        appealDue: {
          time: 8,
          duration: 'weeks',
        },
        questionnaireDue: {
          time: 1,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.MINOR_COMMERCIAL]: {
        id: '',
        name: 'Minor Commercial (shopfront)',
        procedureType: [WRITTEN_REPRESENTATION],
        appealDue: {
          time: 12,
          duration: 'weeks',
        },
        questionnaireDue: {
          time: 1,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.HEDGEROW]: {
        id: '5',
        name: 'Hedgerow',
        procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
        appealDue: {
          time: 28,
          duration: 'days',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.HIGH_HEDGES]: {
        id: '5',
        name: 'High hedges',
        procedureType: [WRITTEN_REPRESENTATION],
        appealDue: {
          time: 28,
          duration: 'days',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
      [APPEAL_ID.FAST_TRACK_TREES]: {
        id: '',
        name: 'Fast Track Trees/Trees',
        procedureType: [WRITTEN_REPRESENTATION, HEARING],
        appealDue: {
          time: 28,
          duration: 'days',
        },
        questionnaireDue: {
          time: 2,
          duration: 'weeks',
        },
      },
    },
  },
  featureFlag: {
    newAppealJourney: process.env.FEATURE_FLAG_NEW_APPEAL_JOURNEY === 'true' || true,
  },
};

module.exports = config;
