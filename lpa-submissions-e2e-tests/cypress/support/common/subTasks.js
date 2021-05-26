export const subTasks = [
  {
    ref: 'Accuracy Appellant Submission',
    id: 'submissionAccuracy',
    url: 'accuracy-submission',
  },
  {
    ref: 'Extra Conditions',
    id: 'extraConditions',
    url: 'extra-conditions',
  },
  {
    ref: 'Other Appeals',
    id: 'otherAppeals',
    url: 'other-appeals',
  },
  {
    ref: 'Upload Plans',
    id: 'plansDecision',
    url: 'plans',
  },
  {
    ref: 'Upload Planning Officers report',
    id: 'officersReport',
    url: 'officers-report',
  },
  {
    ref: 'Representations from Interested parties',
    id: 'representationsInterestedParties',
    url: 'representation',
  },
  {
    ref: 'Notifying interested parties of the appeal',
    id: 'interestedPartiesAppeal',
    url: 'notifications',
  },
  {
    ref: 'Site notices',
    id: 'siteNotices',
    url: 'site-notice',
  },
  {
    ref: 'Planning history',
    id: 'planningHistory',
    url: 'planning-history',
  },
  {
    ref: 'Other relevant policies',
    id: 'otherPolicies',
    url: 'other-policies',
  },
  {
    ref: 'Development Plan',
    id: 'developmentOrNeighbourhood',
    url: 'development-plan',
  },
  {
    ref: 'Statutory development plan policy',
    id: 'statutoryDevelopment',
    url: 'statutory-development',
  },
];

export const getSubTaskInfo = (subTaskRef) => {
  const subTask = subTasks.find((st) => st.ref === subTaskRef);

  if (!subTask) throw new Error(`Unknown sub task name = ${subTaskRef}`);

  return subTask;
};
