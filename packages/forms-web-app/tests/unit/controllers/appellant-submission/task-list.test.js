const taskListController = require('../../../../src/controllers/appellant-submission/task-list');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
  CANNOT_START_YET,
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../src/services/task-status/task-statuses');

describe('controllers/appellant-submission/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 12,
          nbCompleted: 0,
          sections: {
            count: 5,
            completed: 0,
          },
        },
        sections: [
          {
            heading: {
              text: 'About you',
            },
            items: [
              {
                href: `/${VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU}`,
                text: 'Your details',
                status: NOT_STARTED,
                attributes: {
                  'yourDetails-status': NOT_STARTED,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the original planning application',
            },
            items: [
              {
                text: 'Planning application number',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER}`,
                status: NOT_STARTED,
                attributes: {
                  'applicationNumber-status': NOT_STARTED,
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: NOT_STARTED,
                attributes: {
                  'originalApplication-status': NOT_STARTED,
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: NOT_STARTED,
                attributes: {
                  'decisionLetter-status': NOT_STARTED,
                },
              },
            ],
          },
          {
            heading: {
              text: 'Your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: NOT_STARTED,
                attributes: {
                  'appealStatement-status': NOT_STARTED,
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: NOT_STARTED,
                attributes: {
                  'otherDocuments-status': NOT_STARTED,
                },
              },
              {
                text: 'Other relevant appeals',
                href: 'other-appeals',
                status: CANNOT_START_YET,
                attributes: {
                  'otherAppeals-status': CANNOT_START_YET,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: NOT_STARTED,
                attributes: {
                  'siteAddress-status': NOT_STARTED,
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: NOT_STARTED,
                attributes: {
                  'siteOwnership-status': NOT_STARTED,
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: NOT_STARTED,
                attributes: {
                  'siteAccess-status': NOT_STARTED,
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: NOT_STARTED,
                attributes: {
                  'healthAndSafety-status': NOT_STARTED,
                },
              },
            ],
          },

          {
            heading: {
              text: 'Submit your appeal',
            },
            items: [
              {
                text: 'Check your answers',
                href: `/${VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS}`,
                status: CANNOT_START_YET,
                attributes: {
                  'checkYourAnswers-status': CANNOT_START_YET,
                },
              },
            ],
          },
        ],
      });
    });

    it('Some tasks still in progress and check your answer cannot be started', () => {
      const req = mockReq({
        aboutYouSection: {
          yourDetails: { isOriginalApplicant: true },
        },
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1',
            county: 'PACA',
            postcode: '06300',
          },
          siteAccess: {
            canInspectorSeeWholeSiteFromPublicRoad: true,
          },
          siteOwnership: {
            ownsWholeSite: false,
          },
        },
        requiredDocumentsSection: {
          applicationNumber: '123',
          originalApplication: {
            uploadedFile: {
              id: '123',
              name: 'original.pdf',
            },
          },
          decisionLetter: {
            uploadedFile: {
              id: '456',
              name: 'decision.pdf',
            },
          },
        },
        yourAppealSection: {
          appealStatement: {
            uploadedFile: {
              id: '789',
              name: 'appeal.pdf',
            },
            hasSensitiveInformation: false,
          },
        },
      });
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 12,
          nbCompleted: 7,
          sections: {
            count: 5,
            completed: 1,
          },
        },
        sections: [
          {
            heading: {
              text: 'About you',
            },
            items: [
              {
                href: `/${VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU}`,
                text: 'Your details',
                status: IN_PROGRESS,
                attributes: {
                  'yourDetails-status': IN_PROGRESS,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the original planning application',
            },
            items: [
              {
                text: 'Planning application number',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER}`,
                status: COMPLETED,
                attributes: {
                  'applicationNumber-status': COMPLETED,
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: COMPLETED,
                attributes: {
                  'originalApplication-status': COMPLETED,
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: COMPLETED,
                attributes: {
                  'decisionLetter-status': COMPLETED,
                },
              },
            ],
          },
          {
            heading: {
              text: 'Your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: COMPLETED,
                attributes: {
                  'appealStatement-status': COMPLETED,
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: NOT_STARTED,
                attributes: {
                  'otherDocuments-status': NOT_STARTED,
                },
              },
              {
                text: 'Other relevant appeals',
                href: 'other-appeals',
                status: CANNOT_START_YET,
                attributes: {
                  'otherAppeals-status': CANNOT_START_YET,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: COMPLETED,
                attributes: {
                  'siteAddress-status': COMPLETED,
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: COMPLETED,
                attributes: {
                  'siteOwnership-status': COMPLETED,
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: COMPLETED,
                attributes: {
                  'siteAccess-status': COMPLETED,
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: NOT_STARTED,
                attributes: {
                  'healthAndSafety-status': NOT_STARTED,
                },
              },
            ],
          },

          {
            heading: {
              text: 'Submit your appeal',
            },
            items: [
              {
                text: 'Check your answers',
                href: `/${VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS}`,
                status: CANNOT_START_YET,
                attributes: {
                  'checkYourAnswers-status': CANNOT_START_YET,
                },
              },
            ],
          },
        ],
      });
    });

    it('All the task should be completed and check your answer can be started', () => {
      const req = mockReq({
        aboutYouSection: {
          yourDetails: { isOriginalApplicant: true, name: 'Joe', email: 'joe@email.com' },
        },
        appealSiteSection: {
          siteAddress: {
            addressLine1: '1',
            county: 'PACA',
            postcode: '06300',
          },
          siteOwnership: {
            ownsWholeSite: false,
            haveOtherOwnersBeenTold: true,
          },
          siteAccess: {
            canInspectorSeeWholeSiteFromPublicRoad: true,
          },
          healthAndSafety: {
            hasIssues: false,
          },
        },
        requiredDocumentsSection: {
          applicationNumber: '123',
          originalApplication: {
            uploadedFile: {
              id: '123',
              name: 'original.pdf',
            },
          },
          decisionLetter: {
            uploadedFile: {
              id: '456',
              name: 'decision.pdf',
            },
          },
        },
        yourAppealSection: {
          appealStatement: {
            uploadedFile: {
              id: '789',
              name: 'appeal.pdf',
            },
            hasSensitiveInformation: false,
          },
        },
      });
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 12,
          nbCompleted: 9,
          sections: {
            count: 5,
            completed: 3,
          },
        },
        sections: [
          {
            heading: {
              text: 'About you',
            },
            items: [
              {
                href: `/${VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU}`,
                text: 'Your details',
                status: COMPLETED,
                attributes: {
                  'yourDetails-status': COMPLETED,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the original planning application',
            },
            items: [
              {
                text: 'Planning application number',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER}`,
                status: COMPLETED,
                attributes: {
                  'applicationNumber-status': COMPLETED,
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: COMPLETED,
                attributes: {
                  'originalApplication-status': COMPLETED,
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: COMPLETED,
                attributes: {
                  'decisionLetter-status': COMPLETED,
                },
              },
            ],
          },
          {
            heading: {
              text: 'Your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: COMPLETED,
                attributes: {
                  'appealStatement-status': COMPLETED,
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: NOT_STARTED,
                attributes: {
                  'otherDocuments-status': NOT_STARTED,
                },
              },
              {
                text: 'Other relevant appeals',
                href: 'other-appeals',
                status: CANNOT_START_YET,
                attributes: {
                  'otherAppeals-status': CANNOT_START_YET,
                },
              },
            ],
          },
          {
            heading: {
              text: 'About the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: COMPLETED,
                attributes: {
                  'siteAddress-status': COMPLETED,
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: COMPLETED,
                attributes: {
                  'siteOwnership-status': COMPLETED,
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: COMPLETED,
                attributes: {
                  'siteAccess-status': COMPLETED,
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: COMPLETED,
                attributes: {
                  'healthAndSafety-status': COMPLETED,
                },
              },
            ],
          },

          {
            heading: {
              text: 'Submit your appeal',
            },
            items: [
              {
                text: 'Check your answers',
                href: `/${VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS}`,
                status: NOT_STARTED,
                attributes: {
                  'checkYourAnswers-status': NOT_STARTED,
                },
              },
            ],
          },
        ],
      });
    });
  });
});
