const genericSections = [
  {
    text: 'Review the procedure type',
    href: '',
    attributes: {
      name: 'procedureTypeReview',
      'procedureTypeReview-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Tell us about constraints, designations and other issues',
    href: '',
    attributes: {
      name: 'issuesConstraintsDesignation',
      'issuesConstraintsDesignation-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: "Tell us if it's an environmental impact assessment development",
    href: '',
    attributes: {
      name: 'environmentalImpactAssessment',
      'environmentalImpactAssessment-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Tell us how you notified people about the application',
    href: '',
    attributes: {
      name: 'peopleNotification',
      'peopleNotification-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Upload consultation responses and representations',
    href: '',
    attributes: {
      name: 'consultationResponse',
      'consultationResponse-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Tell the Inspector about site access',
    href: '',
    attributes: {
      name: 'siteAccess',
      'siteAccess-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Provide additional information for the Inspector',
    href: '',
    attributes: {
      name: 'additionalInformation',
      'additionalInformation-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
  {
    text: 'Check your answers and submit',
    href: '',
    attributes: {
      name: 'questionnaireSubmission',
      'questionnaireSubmission-status': 'CANNOT START YET',
    },
    status: 'CANNOT START YET',
  },
];

const deterministicSections = [
  {
    text: "Upload the Planning Officer's report and relevant policies",
    href: '',
    attributes: {
      name: 'planningOfficerReport',
      'planningOfficerReport-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
];

const nonDeterministicSections = [
  {
    text: 'Tell us what your decision notice would have said and provide relevant policies',
    href: '',
    attributes: {
      name: 'decisionNotice',
      'decisionNotice-status': 'NOT STARTED',
    },
    status: 'NOT STARTED',
  },
];

module.exports = {
  genericSections,
  deterministicSections,
  nonDeterministicSections,
};
