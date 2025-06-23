const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const { VIEW } = require('../../../src/lib/views');
const {
	CANNOT_START_YET,
	COMPLETED,
	IN_PROGRESS,
	NOT_STARTED
} = require('../../../src/services/task-status/task-statuses');
const {
	SECTIONS,
	getNextTask,
	getTaskStatus,
	setTaskStatusComplete,
	setTaskStatusNotStarted
} = require('../../../src/services/task.service');

beforeEach(() => {
	jest.resetAllMocks();
});

const completedAppeal = {
	requiredDocumentsSection: {
		originalApplication: {
			uploadedFile: {
				id: 'asdsad'
			}
		},
		decisionLetter: {
			uploadedFile: {
				id: 'wwewe'
			}
		}
	},
	aboutYouSection: {
		yourDetails: {
			isOriginalApplicant: true,
			name: 'test name'
		}
	},
	appealSiteSection: {
		siteAddress: {
			addressLine1: 'test',
			postcode: 'TW8 1RT'
		},
		siteOwnership: {
			ownsWholeSite: true
		},
		siteAccess: {
			canInspectorSeeWholeSiteFromPublicRoad: true
		},
		healthAndSafety: {
			hasIssues: true
		}
	},
	yourAppealSection: {
		appealStatement: {
			uploadedFile: {
				id: 'id'
			}
		},
		otherDocuments: {
			uploadedFiles: [{}]
		}
	}
};

describe('services/task.service', () => {
	describe('getNextTask', () => {
		it('should return next on going task', async () => {
			const appeal = {
				sectionStates: {
					Section1: {
						Task1: IN_PROGRESS,
						Task2: CANNOT_START_YET,
						Task3: COMPLETED,
						Task4: IN_PROGRESS
					}
				}
			};

			const task = getNextTask(
				appeal,
				{
					sectionName: 'Section1',
					taskName: 'Task1'
				},
				appeal.sectionStates
			);

			expect(task.taskName).toEqual('Task3');
		});
		it('should return task list as all the remaining section tasks cannot be started yet', async () => {
			const appeal = {
				sectionStates: {
					Section1: {
						Task1: IN_PROGRESS,
						Task2: CANNOT_START_YET,
						Task3: CANNOT_START_YET,
						Task4: CANNOT_START_YET
					}
				}
			};

			const task = getNextTask(
				appeal,
				{
					sectionName: 'Section1',
					taskName: 'Task1'
				},
				appeal.sectionStates
			);

			expect(task.href).toEqual(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
		});
	});

	describe('SECTIONS', () => {
		it('should return early from statusCheckYourAnswer if the appeal is already submitted ', () => {
			expect(
				SECTIONS.submitYourAppealSection.checkYourAnswers.rule({ state: 'SUBMITTED' })
			).toEqual(COMPLETED);
		});
		it('should return COMPLETED from statusSupportingDocuments if the appeal has other documents', () => {
			expect(
				SECTIONS.yourAppealSection.otherDocuments.rule({
					sectionStates: {
						yourAppealSection: {
							otherDocuments: 'NOT_STARTED'
						}
					},
					yourAppealSection: {
						otherDocuments: {
							uploadedFiles: [{}]
						}
					}
				})
			).toEqual(COMPLETED);
		});

		it('should return COMPLETED from statusSupportingDocuments if appeal has no documents but sectionState is complete', () => {
			expect(
				SECTIONS.yourAppealSection.otherDocuments.rule({
					sectionStates: {
						yourAppealSection: {
							otherDocuments: 'COMPLETED'
						}
					},
					yourAppealSection: {
						otherDocuments: {
							uploadedFiles: []
						}
					}
				})
			).toEqual(COMPLETED);
		});

		it('should return NOT_STARTED from statusAppealStatement if id is empty', () => {
			expect(
				SECTIONS.yourAppealSection.appealStatement.rule({
					yourAppealSection: {
						appealStatement: {
							uploadedFile: {}
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return NOT_STARTED from statusSupportingDocuments if uploadedFiles empty and sectionState is not complete', () => {
			expect(
				SECTIONS.yourAppealSection.otherDocuments.rule({
					sectionStates: {
						yourAppealSection: {
							otherDocuments: 'NOT_STARTED'
						}
					},
					yourAppealSection: {
						otherDocuments: {
							uploadedFiles: []
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return NOT_STARTED from statusDecisionLetter if id is empty', () => {
			expect(
				SECTIONS.requiredDocumentsSection.decisionLetter.rule({
					requiredDocumentsSection: {
						decisionLetter: {
							uploadedFile: {}
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return NOT_STARTED from statusOriginalApplication if id is empty', () => {
			expect(
				SECTIONS.requiredDocumentsSection.originalApplication.rule({
					requiredDocumentsSection: {
						originalApplication: {
							uploadedFile: {}
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return NOT_STARTED from statusHealthAndSafety if healthAndSafety.hasIssues is null', () => {
			expect(
				SECTIONS.appealSiteSection.healthAndSafety.rule({
					appealSiteSection: {}
				})
			).toEqual(NOT_STARTED);
			expect(
				SECTIONS.appealSiteSection.healthAndSafety.rule({
					appealSiteSection: {
						healthAndSafety: {
							hasIssues: null
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return NOT_STARTED from statusSiteAccess if canInspectorSeeWholeSiteFromPublicRoad is null', () => {
			expect(
				SECTIONS.appealSiteSection.siteAccess.rule({
					appealSiteSection: {
						siteAccess: {
							canInspectorSeeWholeSiteFromPublicRoad: null
						}
					}
				})
			).toEqual(NOT_STARTED);
		});
		it('should return "NOT STARTED" from statusCheckYourAnswer if all sections have been COMPLETED but the appeal is not submitted ', () => {
			expect(SECTIONS.submitYourAppealSection.checkYourAnswers.rule(completedAppeal)).toEqual(
				NOT_STARTED
			);
		});
		it('should return "CANNOT START YET" from statusCheckYourAnswer if not all sections have been COMPLETED and the appeal is not submitted ', () => {
			const incompletedAppeal = {
				...completedAppeal,
				aboutYouSection: {
					yourDetails: {
						isOriginalApplicant: true,
						name: undefined
					}
				}
			};
			expect(SECTIONS.submitYourAppealSection.checkYourAnswers.rule(incompletedAppeal)).toEqual(
				CANNOT_START_YET
			);
		});
	});

	describe('getNextTask', () => {
		[
			{
				appeal: {
					sectionStates: {
						Section1: {
							Task1: CANNOT_START_YET
						}
					}
				},
				currentTask: {
					sectionName: 'Section1',
					taskName: 'Task1'
				},
				expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` }
			},
			{
				appeal: {
					sectionStates: {
						Section1: {
							Task1: CANNOT_START_YET,
							Task2: CANNOT_START_YET
						}
					}
				},
				currentTask: {
					sectionName: 'Section1',
					taskName: 'Task2'
				},
				expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` }
			},
			{
				appeal: {
					sectionStates: {
						Section1: {
							Task1: IN_PROGRESS,
							Task2: CANNOT_START_YET,
							Task3: CANNOT_START_YET,
							Task4: CANNOT_START_YET
						}
					}
				},
				currentTask: {
					sectionName: 'Section1',
					taskName: 'Task1'
				},
				expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` }
			},
			{
				appeal: {
					sectionStates: {
						Section1: {
							Task1: IN_PROGRESS,
							Task2: IN_PROGRESS,
							Task3: IN_PROGRESS,
							Task4: IN_PROGRESS
						}
					}
				},
				currentTask: {
					sectionName: 'Section1',
					taskName: 'Task1'
				},
				expected: { href: undefined, status: IN_PROGRESS, taskName: 'Task2' }
			}
		].forEach(({ appeal, currentTask, expected }) => {
			it('should return the expected next on going task', () => {
				expect(getNextTask(appeal, currentTask, appeal.sectionStates)).toEqual(expected);
			});
		});

		it('should fall through to default even when allowing `sections` to be an optional parameter', () => {
			const appeal = {};
			const currentTask = {
				sectionName: 'aboutYouSection',
				taskName: 'yourDetails'
			};
			expect(getNextTask(appeal, currentTask)).toEqual({
				href: '/appeal-householder-decision/task-list'
			});
		});

		it('should allow `sections` to be an optional parameter', () => {
			const appeal = {
				...householderAppeal,
				sectionStates: {
					aboutYouSection: {
						yourDetails: IN_PROGRESS
					},
					requiredDocumentsSection: {
						originalApplication: NOT_STARTED,
						decisionLetter: NOT_STARTED
					}
				}
			};
			const currentTask = {
				sectionName: 'requiredDocumentsSection',
				taskName: 'originalApplication'
			};
			expect(getNextTask(appeal, currentTask)).toEqual({
				href: '/appellant-submission/upload-decision',
				status: COMPLETED,
				taskName: 'decisionLetter'
			});
		});
	});

	describe('#getTaskStatus', () => {
		const ruleUnderTask = jest.fn();
		const ruleUnderSection = jest.fn();

		const sections = {
			section1: {
				task1: {
					rule: ruleUnderTask
				},
				rule: ruleUnderSection
			}
		};

		it('should find the rule in the task object if there is a taskName', () => {
			getTaskStatus({}, 'section1', 'task1', sections);
			expect(ruleUnderTask).toHaveBeenCalledTimes(1);
			expect(ruleUnderSection).toHaveBeenCalledTimes(0);
		});

		it('should find the rule in the section object if there is not a taskName', () => {
			getTaskStatus({}, 'section1', undefined, sections);
			expect(ruleUnderSection).toHaveBeenCalledTimes(1);
			expect(ruleUnderTask).toHaveBeenCalledTimes(0);
		});

		it('should return null if there is an error', () => {
			const taskStatus = getTaskStatus({}, 'section1', undefined, sections);
			ruleUnderSection.mockImplementation(() => {
				throw new Error('Mock Error');
			});
			expect(ruleUnderSection).toHaveBeenCalledTimes(1);
			expect(taskStatus).toBeUndefined();
		});
	});

	describe('setTaskStatusComplete', () => {
		it('should return completed task status', () => {
			expect(setTaskStatusComplete()).toBe(COMPLETED);
		});
	});

	describe('setTaskStatusNotStarted', () => {
		it('should return not started task status', () => {
			expect(setTaskStatusNotStarted()).toBe(NOT_STARTED);
		});
	});
});
