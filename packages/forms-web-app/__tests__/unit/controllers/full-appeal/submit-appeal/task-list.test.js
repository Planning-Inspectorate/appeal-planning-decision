const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getTaskList
} = require('../../../../../src/controllers/full-appeal/submit-appeal/task-list');
const {
	VIEW: {
		FULL_APPEAL: {
			TASK_LIST,
			ORIGINAL_APPLICANT,
			APPLICATION_FORM,
			APPEAL_STATEMENT,
			CHECK_YOUR_ANSWERS,
			HOW_DECIDE_APPEAL,
			APPEAL_SITE_ADDRESS
		}
	}
} = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/task-list', () => {
	describe('getTaskList', () => {
		it('All the tasks except check answers should be in not started', () => {
			const mockAppeal = structuredClone(appeal);
			delete mockAppeal.hideFromDashboard;
			const req = mockReq({
				...mockAppeal,
				state: undefined
			});
			const res = mockRes();

			getTaskList(req, res);

			expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
				applicationStatus: 'Appeal incomplete',
				sectionInfo: {
					nbTasks: 6,
					nbCompleted: 0
				},
				sections: [
					{
						href: `/${ORIGINAL_APPLICANT}`,
						text: 'Provide your contact details',
						status: 'NOT STARTED',
						attributes: {
							'contactDetailsSection-status': 'NOT STARTED',
							name: 'contactDetailsSection'
						}
					},
					{
						href: `/${APPEAL_SITE_ADDRESS}`,
						text: 'Tell us about the appeal site',
						status: 'NOT STARTED',
						attributes: {
							'appealSiteSection-status': 'NOT STARTED',
							name: 'appealSiteSection'
						}
					},
					{
						href: `/${HOW_DECIDE_APPEAL}`,
						text: 'Tell us how you would prefer us to decide your appeal',
						status: 'NOT STARTED',
						attributes: {
							'appealDecisionSection-status': 'NOT STARTED',
							name: 'appealDecisionSection'
						}
					},
					{
						href: `/${APPLICATION_FORM}`,
						text: 'Upload documents from your planning application',
						status: 'NOT STARTED',
						attributes: {
							'planningApplicationDocumentsSection-status': 'NOT STARTED',
							name: 'planningApplicationDocumentsSection'
						}
					},
					{
						href: `/${APPEAL_STATEMENT}`,
						text: 'Upload documents for your appeal',
						status: 'NOT STARTED',
						attributes: {
							'appealDocumentsSection-status': 'NOT STARTED',
							name: 'appealDocumentsSection'
						}
					},
					{
						href: `/${CHECK_YOUR_ANSWERS}`,
						text: 'Check your answers and submit your appeal',
						status: 'CANNOT START YET',
						attributes: {
							'submitYourAppealSection-status': 'CANNOT START YET',
							name: 'submitYourAppealSection'
						}
					}
				]
			});
		});
	});
});
