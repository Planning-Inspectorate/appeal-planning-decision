const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');
const taskListController = require('../../../../src/controllers/full-appeal/task-list');
const {
  VIEW: { TASK_LIST },
} = require('../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../full-appeal/mocks');

describe('controllers/full-appeal/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started - Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: {
          address: '11 kingston Road, Bristol, BR12 7AU',
          appellant: 'Someone',
          number: '12345',
        },
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 9,
        sections: [
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
              name: 'peoplNotification',
              'peoplNotification-status': 'NOT STARTED',
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
            text: "Upload the Planning Officer's report and relevant policies",
            href: '',
            attributes: {
              name: 'planningOfficerReport',
              'planningOfficerReport-status': 'NOT STARTED',
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
        ],
      });
    });

    it('All the tasks except check answers should be in not started - Non-Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      req.session.appeal.eligibility.applicationDecision = APPLICATION_DECISION.NODECISIONRECEIVED;
      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: {
          address: '11 kingston Road, Bristol, BR12 7AU',
          appellant: 'Someone',
          number: '12345',
        },
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 9,
        sections: [
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
              name: 'peoplNotification',
              'peoplNotification-status': 'NOT STARTED',
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
            text: 'Tell us what your decision notice would have said and provide relevant policies',
            href: '',
            attributes: {
              name: 'decisionNotice',
              'decisionNotice-status': 'NOT STARTED',
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
        ],
      });
    });

    it('All the tasks except check answers should be in not started - Non-Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      req.session.appeal.appealType = APPEAL_ID.HOUSEHOLDER;
      req.session.appeal.eligibility.applicationDecision = APPLICATION_DECISION.NODECISIONRECEIVED;
      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: {
          address: '11 kingston Road, Bristol, BR12 7AU',
          appellant: 'Someone',
          number: '12345',
        },
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 8,
        sections: [
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
              name: 'peoplNotification',
              'peoplNotification-status': 'NOT STARTED',
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
        ],
      });
    });
  });
});
