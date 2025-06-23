const {
	getCertificates,
	postCertificates
} = require('../../../../../src/controllers/full-appeal/submit-appeal/certificates');
const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { CERTIFICATES, PROPOSED_DEVELOPMENT_CHANGED }
	}
} = require('../../../../../src/lib/views');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');

const v8 = require('v8');
const appeal = require('../../../../mockData/full-appeal');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/certificates', () => {
	let req;
	let res;

	const sectionName = 'planningApplicationDocumentsSection';
	const taskName = documentTypes.ownershipCertificate.name;
	const errors = {
		'file-upload': 'Select your ownership certificate and agricultural land declaration'
	};
	const errorSummary = [{ text: 'There was an error', href: '#' }];
	const sectionTag = 'OWNERSHIP CERTIFICATE';

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getCertificates', () => {
		it('calls correct template', async () => {
			await getCertificates(req, res);
			expect(res.render).toHaveBeenCalledWith(CERTIFICATES, {
				appealId: appeal.id,
				uploadedFile: appeal[sectionName][taskName].uploadedFile
			});
		});
	});

	describe('postOriginalDecisionNotice', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					errors,
					errorSummary
				},
				files: {
					'file-upload': {}
				}
			};

			await postCertificates(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CERTIFICATES, {
				appealId: appeal.id,
				uploadedFile: appeal[sectionName][taskName].uploadedFile,
				errorSummary,
				errors
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postCertificates(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CERTIFICATES, {
				appealId: appeal.id,
				uploadedFile: appeal[sectionName][taskName].uploadedFile,
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if valid and a file is being uploaded', async () => {
			appeal.sectionStates.planningApplicationDocumentsSection.ownershipCertificate =
				TASK_STATUS.COMPLETED;
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};

			createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {},
				files: {
					'file-upload': appeal[sectionName][taskName].uploadedFile
				}
			};

			await postCertificates(req, res);

			expect(createDocument).toHaveBeenCalledWith(
				appeal,
				appeal[sectionName][taskName].uploadedFile,
				null,
				taskName,
				sectionTag
			);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${PROPOSED_DEVELOPMENT_CHANGED}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
			appeal.sectionStates.planningApplicationDocumentsSection.ownershipCertificate =
				TASK_STATUS.COMPLETED;
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			await postCertificates(req, res);

			expect(createDocument).not.toHaveBeenCalled();
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${PROPOSED_DEVELOPMENT_CHANGED}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
