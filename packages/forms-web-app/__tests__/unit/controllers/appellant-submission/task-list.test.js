const taskListController = require('../../../../src/controllers/appellant-submission/task-list');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/appellant-submission/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 11,
          nbCompleted: 10,
          sections: {
            count: 5,
            completed: 4,
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
                status: 'COMPLETED',
                attributes: {
                  'yourDetails-status': 'COMPLETED',
                  name: 'yourDetails',
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
                status: 'COMPLETED',
                attributes: {
                  'applicationNumber-status': 'COMPLETED',
                  name: 'applicationNumber',
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: 'COMPLETED',
                attributes: {
                  'originalApplication-status': 'COMPLETED',
                  name: 'originalApplication',
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: 'COMPLETED',
                attributes: {
                  'decisionLetter-status': 'COMPLETED',
                  name: 'decisionLetter',
                },
              },
            ],
          },
          {
            heading: {
              text: 'About your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: 'COMPLETED',
                attributes: {
                  'appealStatement-status': 'COMPLETED',
                  name: 'appealStatement',
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: 'COMPLETED',
                attributes: {
                  'otherDocuments-status': 'COMPLETED',
                  name: 'otherDocuments',
                },
              },
            ],
          },
          {
            heading: {
              text: 'Visiting the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAddress-status': 'COMPLETED',
                  name: 'siteAddress',
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: 'COMPLETED',
                attributes: {
                  'siteOwnership-status': 'COMPLETED',
                  name: 'siteOwnership',
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAccess-status': 'COMPLETED',
                  name: 'siteAccess',
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: 'COMPLETED',
                attributes: {
                  'healthAndSafety-status': 'COMPLETED',
                  name: 'healthAndSafety',
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
                status: 'NOT STARTED',
                attributes: {
                  'checkYourAnswers-status': 'NOT STARTED',
                  name: 'checkYourAnswers',
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
          otherDocuments: {
            uploadedFiles: [
              {
                id: '000',
                name: 'support-0.pdf',
              },
              {
                id: '001',
                name: 'support-1.pdf',
              },
            ],
          },
        },
      });
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 11,
          nbCompleted: 8,
          sections: {
            count: 5,
            completed: 2,
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
                status: 'IN PROGRESS',
                attributes: {
                  'yourDetails-status': 'IN PROGRESS',
                  name: 'yourDetails',
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
                status: 'COMPLETED',
                attributes: {
                  'applicationNumber-status': 'COMPLETED',
                  name: 'applicationNumber',
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: 'COMPLETED',
                attributes: {
                  'originalApplication-status': 'COMPLETED',
                  name: 'originalApplication',
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: 'COMPLETED',
                attributes: {
                  'decisionLetter-status': 'COMPLETED',
                  name: 'decisionLetter',
                },
              },
            ],
          },
          {
            heading: {
              text: 'About your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: 'COMPLETED',
                attributes: {
                  'appealStatement-status': 'COMPLETED',
                  name: 'appealStatement',
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: 'COMPLETED',
                attributes: {
                  'otherDocuments-status': 'COMPLETED',
                  name: 'otherDocuments',
                },
              },
            ],
          },
          {
            heading: {
              text: 'Visiting the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAddress-status': 'COMPLETED',
                  name: 'siteAddress',
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: 'COMPLETED',
                attributes: {
                  'siteOwnership-status': 'COMPLETED',
                  name: 'siteOwnership',
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAccess-status': 'COMPLETED',
                  name: 'siteAccess',
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: 'NOT STARTED',
                attributes: {
                  'healthAndSafety-status': 'NOT STARTED',
                  name: 'healthAndSafety',
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
                status: 'CANNOT START YET',
                attributes: {
                  'checkYourAnswers-status': 'CANNOT START YET',
                  name: 'checkYourAnswers',
                },
              },
            ],
          },
        ],
      });
    });

    it('All the mandatory tasks should be completed and check your answer can be started', () => {
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
          otherDocuments: {
            uploadedFiles: [],
          },
        },
      });
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 11,
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
                status: 'COMPLETED',
                attributes: {
                  'yourDetails-status': 'COMPLETED',
                  name: 'yourDetails',
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
                status: 'COMPLETED',
                attributes: {
                  'applicationNumber-status': 'COMPLETED',
                  name: 'applicationNumber',
                },
              },
              {
                text: 'Upload the original planning application form',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
                status: 'COMPLETED',
                attributes: {
                  'originalApplication-status': 'COMPLETED',
                  name: 'originalApplication',
                },
              },
              {
                text: 'Upload the decision letter',
                href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
                status: 'COMPLETED',
                attributes: {
                  'decisionLetter-status': 'COMPLETED',
                  name: 'decisionLetter',
                },
              },
            ],
          },
          {
            heading: {
              text: 'About your appeal',
            },
            items: [
              {
                text: 'Your appeal statement',
                href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
                status: 'COMPLETED',
                attributes: {
                  'appealStatement-status': 'COMPLETED',
                  name: 'appealStatement',
                },
              },
              {
                text: 'Any other documents to support your appeal',
                href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
                status: 'NOT STARTED',
                attributes: {
                  'otherDocuments-status': 'NOT STARTED',
                  name: 'otherDocuments',
                },
              },
            ],
          },
          {
            heading: {
              text: 'Visiting the appeal site',
            },
            items: [
              {
                text: 'Address of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAddress-status': 'COMPLETED',
                  name: 'siteAddress',
                },
              },
              {
                text: 'Ownership of the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
                status: 'COMPLETED',
                attributes: {
                  'siteOwnership-status': 'COMPLETED',
                  name: 'siteOwnership',
                },
              },
              {
                text: 'Access to the appeal site',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`,
                status: 'COMPLETED',
                attributes: {
                  'siteAccess-status': 'COMPLETED',
                  name: 'siteAccess',
                },
              },
              {
                text: 'Any health and safety issues',
                href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
                status: 'COMPLETED',
                attributes: {
                  'healthAndSafety-status': 'COMPLETED',
                  name: 'healthAndSafety',
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
                status: 'NOT STARTED',
                attributes: {
                  'checkYourAnswers-status': 'NOT STARTED',
                  name: 'checkYourAnswers',
                },
              },
            ],
          },
        ],
      });
    });
  });
});
