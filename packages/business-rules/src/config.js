const {
  APPEAL_ID,
  PROCEDURE_TYPE: { WRITTEN_REPRESENTATION, HEARING, INQUIRY },
} = require('./constants');

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
          time: 12,
          duration: 'weeks',
        },
        questionnaireDue: {
          time: 5,
          duration: 'days',
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
  procedure: {
    type: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
  },
};

module.exports = config;
