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
    ref: 'Development Plan',
    id: 'developmentOrNeighbourhood',
    url: 'development-plan',
  },
];

export const getSubTaskInfo = (subTaskRef) => {
  const subTask = subTasks.find((st) => st.ref === subTaskRef);

  if (!subTask) throw new Error(`Unknown sub task name = ${subTaskRef}`);

  return subTask;
};
